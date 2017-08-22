package ca.tonita;

import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;

/**
 * A Java Scripting wrapper around the Katex library to take latex input and output html.
 */
public class KatexProcessor {
    private static final String BASE_KATEX_PATH = "classpath:/META-INF/resources/webjars/katex/**/dist/katex.min.js";
    public static final String KATEX_RENDER_TO_STRING = "renderToString";
    private final ScriptEngine katexEngine;
    private final Object katex;

    /**
     * Constructs a new {@link KatexProcessor}. Performs class path scanning using the Spring
     * {@link PathMatchingResourcePatternResolver} in order to find a minified katex script on the class path.
     *
     * @throws AssertionError If the katex library is not found or is invalid.
     */
    public KatexProcessor() {
        katexEngine = readKatexScript();
        katex = katexEngine.get("katex");
    }

    /**
     * Reads the katex script and returns a {@link ScriptEngine} with the library eval()ed.
     *
     * @return The ready katex {@link ScriptEngine}
     * @throws AssertionError If this is thrown during {@link ScriptEngine#eval(Reader)} of the katex library. This
     *                        should only really happen if the library is invalid javascript.
     */
    private static ScriptEngine readKatexScript() {
        Reader minifiedKatex = getMinifiedKatex();
        ScriptEngineManager manager = new ScriptEngineManager();
        ScriptEngine engine = manager.getEngineByName("JavaScript");
        try {
            engine.eval(minifiedKatex);
        } catch (ScriptException e) {
            throw new AssertionError("Katex library could not be evalutated.", e);
        }
        return engine;
    }

    /**
     * Returns a reader to the first found minified katex script on the class path.
     *
     * @return The reader to the first found minified katex script.
     * @throws AssertionError If no version of katex is found.
     */
    private static Reader getMinifiedKatex() {
        try {
            PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
            Resource[] resources = resolver.getResources(BASE_KATEX_PATH);
            if (resources.length == 0) {
                throw new AssertionError("Katex minified javascript not found in dist resource." +
                        " This version of katex may be unsupported.");
            }
            return new InputStreamReader(resources[0].getInputStream());
        } catch (IOException e) {
            throw new AssertionError("Katex not found in class path at expected location.", e);
        }
    }

    /**
     * Processes latex equation input, returning katex rendered html.
     *
     * @param latex The latex equation to render.
     * @return The rendered html.
     * @throws IllegalArgumentException If the input causes a {@link ScriptException}.
     * @throws AssertionError           If the renderToString method is not found in the katex library which was found.
     */
    public String processEquation(String latex) {
        // Invocable is optional, but implemented by the javascript engine.
        try {
            return (String) ((Invocable) katexEngine).invokeMethod(katex, KATEX_RENDER_TO_STRING, latex);
        } catch (ScriptException e) {
            throw new IllegalArgumentException("Bad input.", e);
        } catch (NoSuchMethodException e) {
            throw new AssertionError("Unable to use katex:" +
                    " renderToString method doesn't exist or was renamed.", e);
        }
    }

    public static void main(String[] args) {
        KatexProcessor processor = new KatexProcessor();
        System.out.println(processor.processEquation("\\frac{dy}{dx}"));
    }
}
