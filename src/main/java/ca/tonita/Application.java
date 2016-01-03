package ca.tonita;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

/**
 * Created by Aaryn Tonita on 2016-01-02.
 * All rights reserved.
 */
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        ConfigurableApplicationContext ctx = SpringApplication.run(Application.class, args);
        for (String bean : ctx.getBeanDefinitionNames()) {
            System.out.println(bean);
        }
    }
}
