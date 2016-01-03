package ca.tonita.utilities;

import org.apache.log4j.Logger;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;

/**
 * Created by Aaryn Tonita on 2016-01-02.
 * All rights reserved.
 */
public class EquationImageMaker {
    private final File baseDir;
    private static final Logger LOGGER = Logger.getLogger(EquationImageMaker.class);
    private static byte[] LATEX_PREFIX = ("\\documentclass{article}\n" +
            "\\pagestyle{empty}\n" +
            "\\begin{document}\n" +
            "$").getBytes(StandardCharsets.UTF_8);
    private static byte[] LATEX_SUFFIX = ("$\n" +
            "\\end{document}").getBytes(StandardCharsets.UTF_8);

    public EquationImageMaker(File baseDir) {
        this.baseDir = baseDir;
    }

    public void process(Properties props) {
        for (Map.Entry<Object, Object> entry : props.entrySet()) {
            String property = entry.getKey().toString();
            String equation = entry.getValue().toString();
            create(property, equation);
        }
    }

    /**
     * Creates an image at a path relative to the property. If property is math.chebyshevRecurrence then the path of the
     * image relative to the base directory will be math\chebyshevRecurrence.svg. It should be noted that windows seems
     * to make the ultimate path all lower case. So it is probably wise to use lower case letters.
     *
     * @param property The property specifying the name of the image.
     * @param equation The equation to render.
     */
    public void create(String property, String equation) {
        String path = property.replaceAll("\\.", Matcher.quoteReplacement(File.separator));
        File tex = new File(baseDir, path + ".tex");
        File dvi = new File(baseDir, path + ".dvi");
        System.out.println(tex.getAbsolutePath());
        try {
            writeLatex(tex, equation);

            executeProcess("latex", tex);

            new File(tex.getAbsolutePath().replaceAll("\\.tex", ".aux")).delete();
            new File(tex.getAbsolutePath().replaceAll("\\.tex", ".log")).delete();

            executeProcess("dvisvgm", dvi);
        } catch (IOException e) {
            LOGGER.error("Couldn't create image for equation " + property, e);
        }
        System.out.println(path);
    }

    /**
     * Writes a bare bones latex file containing the equation.
     *
     * @param tex      The file to write.
     * @param equation The equation to write.
     * @throws IOException If the file cannot be written.
     */
    private void writeLatex(File tex, String equation) throws IOException {
        tex.getParentFile().mkdirs();
        try (FileOutputStream fos = new FileOutputStream(tex)) {
            fos.write(LATEX_PREFIX);
            fos.write(equation.getBytes(StandardCharsets.UTF_8));
            fos.write(LATEX_SUFFIX);
        }
    }

    /**
     * Executes a process against a target file. Waits for the process to exit for 10 seconds, otherwise throws an
     * IOException. The target is deleted at the end, provided that the command executes cleanly.
     *
     * @param commandLine The commandline to run, excluding the target.
     * @param target The target to execute against.
     * @throws IOException If the command doesn't terminate cleanly.
     */
    private void executeProcess(String commandLine, File target) throws IOException {
        try {
            Process process = Runtime.getRuntime().exec(commandLine + " " + target.getAbsolutePath(), null, target.getParentFile());
            boolean exited = process.waitFor(10, TimeUnit.SECONDS);
            int exitValue = exited ? process.exitValue() : -1;
            if (exitValue != 0) {
                throw new IOException("Exited uncleanly...");
            }
            target.delete();
        } catch (InterruptedException e) {
            throw new IOException("Couldn't execute " + commandLine + " cleanly", e);
        }
    }

    public static void main(String[] args) {
        File src = new File("src");
        File main = new File(src, "main");
        File resources = new File(main, "resources");
        File pub = new File(resources, "static");
        File images = new File(pub, "images");
        EquationImageMaker maker = new EquationImageMaker(images);

        File equations = new File(main, "equations");
        for (File propertyFile : equations.listFiles()) {
            Properties props = new Properties();
            try (FileInputStream fin = new FileInputStream(propertyFile)) {
                props.load(fin);
                maker.process(props);
            } catch (IOException e) {
                LOGGER.error("Couldn't read property file.", e);
            }
        }
    }
}
