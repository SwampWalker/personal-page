package ca.tonita;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Created by Aaryn Tonita on 2016-07-05.
 * All rights reserved.
 */
@Configuration
public class TonitaConfiguration {
    @Bean
    public TopicIndexer getTopicIndexer() {
        return new TopicIndexer();
    }
}
