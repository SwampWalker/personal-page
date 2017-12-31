package ca.tonita.controllers;

import ca.tonita.LinkData;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Aaryn Tonita on 2016-01-02.
 */
@Controller
@RequestMapping("/{subject:numerical|physics}")
public class StaticBlog {

    private Map<String, List<LinkData>> links = subjects();

    @RequestMapping
    public String index(@PathVariable String subject,
                        ModelMap model) {
        model.put("links", links.get(subject));
        return subject + "/index";
    }

    @RequestMapping("/{topic}")
    public String article(@PathVariable String subject,
                          @PathVariable String topic) {
        return subject + "/" + topic;
    }

    private Map<String, List<LinkData>> subjects() {
        Map<String, List<LinkData>> subjects = new HashMap<>();
        subjects.put("numerical", mathTopics());
        subjects.put("physics", physicsTopics());
        return subjects;
    }

    private static List<LinkData> mathTopics() {
        ArrayList<LinkData> links = new ArrayList<>();
        links.add(new LinkData().setAddress("numerical/pseudospectral.html")
                .setTitle("Pseudospectral methods")
                .setDescription("A high level presentation of Chebyshev polynomials and their use in solving PDEs" +
                        " through Pseudospectral methods"));
        links.add(new LinkData().setAddress("numerical/multiDimensionalIndexing.html")
                .setTitle("Multidimensional indexing and differential matrix structure")
                .setDescription("An outline of a particular strategy for multidimensional indexing of discrete fields" +
                        " and the structure of the resulting differential matrices."));
        links.add(new LinkData().setAddress("numerical/coordinateMapping.html")
                .setTitle("Coordinate mappings")
                .setDescription("Derivation of factor expansions for numerical problems when the underlying discrete" +
                        " coordinates are mapped via complex functions onto the physical coordinates."));
        return links;
    }

    private static List<LinkData> physicsTopics() {
        ArrayList<LinkData> links = new ArrayList<>();
        links.add(new LinkData().setAddress("physics/tov.html")
                .setTitle("Tolman-Oppenheimer-Volkoff (TOV) pde")
                .setDescription("Relativistic pde for a self gravitating, spherically symmetric ball of fluid."));
        return links;
    }

}
