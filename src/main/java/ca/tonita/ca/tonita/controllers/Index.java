package ca.tonita.ca.tonita.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by Aaryn Tonita on 2016-01-02.
 * All rights reserved.
 */
@Controller
public class Index {
    @RequestMapping("/")
    String index() {
        return "index";
    }
}
