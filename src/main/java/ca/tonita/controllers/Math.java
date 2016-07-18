package ca.tonita.controllers;

import ca.tonita.LinkData;
import ca.tonita.TopicIndexer;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.inject.Inject;
import java.util.List;
import java.util.Objects;

/**
 * Created by Aaryn Tonita on 2016-01-02.
 * All rights reserved.
 */
@Controller
@RequestMapping("/math")
public class Math implements InitializingBean {

    private final TopicIndexer topicIndexer;
    private List<LinkData> links;

    @Inject
    public Math(TopicIndexer topicIndexer) {
        Objects.requireNonNull(topicIndexer, "The TopicIndexer is required to index math topics.");
        this.topicIndexer = topicIndexer;
    }
    @RequestMapping
    public String index(ModelMap model) {
        model.put("template", "math/index");
        model.put("links", links);
        return "base";
    }

    @RequestMapping("/{topic}")
    public String article(@PathVariable String topic, ModelMap model) {
        model.put("template", "math/" + topic);
        return "base";
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        links = topicIndexer.index("math");
    }

}
