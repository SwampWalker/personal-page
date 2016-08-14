package ca.tonita.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Aaryn Tonita on 2016-01-02.
 * All rights reserved.
 */
@Controller
public class Index {
    @RequestMapping("/")
    public String index(ModelMap model) {
        model.put("template", "index");
        return "base";
    }
}
