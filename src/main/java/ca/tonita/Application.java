package ca.tonita;

import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.util.ResourceBundle;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Created by Aaryn Tonita on 2016-01-02.
 * All rights reserved.
 */
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        Reflections reflections = new Reflections(new ConfigurationBuilder().setScanners(new ResourcesScanner())
                .setUrls(ClasspathHelper.forPackage("ca.tonita")));
        Set<String> resources = reflections.getResources(Pattern.compile(".*\\.html"));
        resources.forEach(System.out::println);
    }
}
