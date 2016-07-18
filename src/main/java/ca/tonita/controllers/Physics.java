package ca.tonita.controllers;

import ca.tonita.LinkData;
import ca.tonita.TopicIndexer;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/physics")
public class Physics implements InitializingBean {

    private final TopicIndexer topicIndexer;
    private List<LinkData> links;

    @Inject
    public Physics(TopicIndexer topicIndexer) {
        Objects.requireNonNull(topicIndexer, "The TopicIndexer is required to index physics topics.");
        this.topicIndexer = topicIndexer;
    }

    @RequestMapping
    public String index(ModelMap model) {
        model.put("template", "physics/index");
        model.put("links", links);
        return "base";
    }

    @RequestMapping("/{topic}")
    public String article(@PathVariable String topic, ModelMap model) {
        model.put("template", "physics/" + topic);
        return "base";
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        links = topicIndexer.index("physics");
    }

}