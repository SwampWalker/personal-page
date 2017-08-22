package ca.tonita;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.fail;

public class KatexProcessorTest {
    @org.junit.Test
    public void processEquation() throws Exception {
        KatexProcessor processor = new KatexProcessor();
        String received = processor.processEquation("\\frac{dy}{dx}");
        String expected = "<span class=\"katex\"><span class=\"katex-mathml\"><math><semantics><mrow><mfrac><mrow><mi>d</mi><mi>y</mi></mrow><mrow><mi>d</mi><mi>x</mi></mrow></mfrac></mrow><annotation encoding=\"application/x-tex\">\\frac{dy}{dx}</annotation></semantics></math></span><span class=\"katex-html\" aria-hidden=\"true\"><span class=\"strut\" style=\"height:0.9322159999999999em;\"></span><span class=\"strut bottom\" style=\"height:1.277216em;vertical-align:-0.345em;\"></span><span class=\"base textstyle uncramped\"><span class=\"mord reset-textstyle textstyle uncramped\"><span class=\"mopen sizing reset-size5 size5 reset-textstyle textstyle uncramped nulldelimiter\"></span><span class=\"mfrac\"><span class=\"vlist\"><span style=\"top:0.345em;\"><span class=\"fontsize-ensurer reset-size5 size5\"><span style=\"font-size:0em;\">\u200B</span></span><span class=\"reset-textstyle scriptstyle cramped mtight\"><span class=\"mord scriptstyle cramped mtight\"><span class=\"mord mathit mtight\">d</span><span class=\"mord mathit mtight\">x</span></span></span></span><span style=\"top:-0.22999999999999998em;\"><span class=\"fontsize-ensurer reset-size5 size5\"><span style=\"font-size:0em;\">\u200B</span></span><span class=\"reset-textstyle textstyle uncramped frac-line\"></span></span><span style=\"top:-0.44610799999999995em;\"><span class=\"fontsize-ensurer reset-size5 size5\"><span style=\"font-size:0em;\">\u200B</span></span><span class=\"reset-textstyle scriptstyle uncramped mtight\"><span class=\"mord scriptstyle uncramped mtight\"><span class=\"mord mathit mtight\">d</span><span class=\"mord mathit mtight\" style=\"margin-right:0.03588em;\">y</span></span></span></span><span class=\"baseline-fix\"><span class=\"fontsize-ensurer reset-size5 size5\"><span style=\"font-size:0em;\">\u200B</span></span>\u200B</span></span></span><span class=\"mclose sizing reset-size5 size5 reset-textstyle textstyle uncramped nulldelimiter\"></span></span></span></span></span>";
        assertEquals(expected, received);

        try {
            received = processor.processEquation("\\fraction{dy}{dx}");
            fail("Expected an IllegalArgumentException when given bad latex.");
        } catch (IllegalArgumentException e) {
            // expected
        }
    }

}
