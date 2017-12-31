package ca.tonita;

import org.thymeleaf.context.ITemplateContext;
import org.thymeleaf.model.IProcessableElementTag;
import org.thymeleaf.processor.element.AbstractElementTagProcessor;
import org.thymeleaf.processor.element.IElementTagStructureHandler;
import org.thymeleaf.templatemode.TemplateMode;

public class ThymeleafKatexEquationProcessor extends AbstractElementTagProcessor {

    private static final String ELEMENT_NAME = "eqn";
    private static final int PRECEDENCE = 10000;
    private final KatexProcessor katexProcessor;

    public ThymeleafKatexEquationProcessor(KatexProcessor katexProcessor) {
        super(
                TemplateMode.HTML,
                ELEMENT_NAME,
                ELEMENT_NAME,
                false,
                null,
                false,
                PRECEDENCE
        );
        this.katexProcessor = katexProcessor;
    }

    @Override
    protected void doProcess(ITemplateContext iTemplateContext, IProcessableElementTag iProcessableElementTag, IElementTagStructureHandler iElementTagStructureHandler) {
        System.out.println("got here!");
    }
}
