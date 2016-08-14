package ca.tonita;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

/**
 * Created by Aaryn Tonita on 2016-07-05.
 * All rights reserved.
 */
@Configuration
public class WebMvcConfiguration extends WebMvcConfigurerAdapter {
    @Bean
    public TopicIndexer getTopicIndexer() {
        return new TopicIndexer();
    }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/login").setViewName("login");
    }
}
