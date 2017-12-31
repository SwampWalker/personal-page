package ca.tonita;

import org.thymeleaf.IEngineConfiguration;
import org.thymeleaf.cache.AlwaysValidCacheEntryValidity;
import org.thymeleaf.cache.ICacheEntryValidity;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.AbstractTemplateResolver;
import org.thymeleaf.templateresource.ITemplateResource;

import java.util.Map;

public class CachedPreprocessedTemplateResolver extends AbstractTemplateResolver {
    @Override
    protected ITemplateResource computeTemplateResource(IEngineConfiguration iEngineConfiguration, String s, String s1, Map<String, Object> map) {
        return null;
    }

    @Override
    protected TemplateMode computeTemplateMode(IEngineConfiguration iEngineConfiguration, String s, String s1, Map<String, Object> map) {
        return TemplateMode.HTML;
    }

    @Override
    protected ICacheEntryValidity computeValidity(IEngineConfiguration iEngineConfiguration, String s, String s1, Map<String, Object> map) {
        return new AlwaysValidCacheEntryValidity();
    }
}
