package ca.tonita;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by Aaryn Tonita on 2016-07-05.
 *
 */
@Configuration
public class WebMvcConfiguration extends WebMvcConfigurerAdapter {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        super.addInterceptors(registry);
        registry.addInterceptor(new BaseTemplateInterceptor());
    }

    @Bean
    public KatexProcessor katexProcessor() {
        return new KatexProcessor();
    }

    @Bean
    public ThymeleafKatexEquationProcessor ThymeleafKatexEquationProcessor(KatexProcessor katexProcessor) {
        return new ThymeleafKatexEquationProcessor(katexProcessor);
    }
}
