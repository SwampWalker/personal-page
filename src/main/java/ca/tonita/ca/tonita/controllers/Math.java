package ca.tonita.ca.tonita.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Aaryn Tonita on 2016-01-02.
 * All rights reserved.
 */
@Controller
@RequestMapping("/math")
public class Math {

    @RequestMapping("/{topic}")
    public String article(@PathVariable String topic, ModelMap model) {
        model.put("template", "math/" + topic);
        return "base";
    }
}
