package ca.tonita;

import org.apache.log4j.Logger;
import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;
import org.reflections.util.ClasspathHelper;
import org.reflections.util.ConfigurationBuilder;
import org.springframework.beans.factory.InitializingBean;
import org.w3c.dom.Document;
import org.xml.sax.EntityResolver;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

import javax.xml.XMLConstants;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * Created by Aaryn Tonita on 2016-07-05.
 * All rights reserved.
 */
public class TopicIndexer implements InitializingBean, EntityResolver {
    private DocumentBuilder documentBuilder;
    private XPathExpression titlePath;
    private XPathExpression descriptionPath;
    private static final Set<String> HTML_RESOURCES = constructHtmlResources();
    private static final String THYMELEAF_SPRING_DTD_BASEPATH = "/org/thymeleaf/dtd/thymeleaf-spring4/";
    private static final String THYMELEAF_DTD_BASEPATH = "/org/thymeleaf/dtd/standard/";

    @Override
    public void afterPropertiesSet() throws Exception {
        documentBuilder = constructDocumentBuilder();
        constructXPaths();
    }

    private static Set<String> constructHtmlResources() {
        Reflections reflections = new Reflections(new ConfigurationBuilder().setScanners(new ResourcesScanner())
                .setUrls(ClasspathHelper.forPackage("ca.tonita")));
        Pattern templatePattern = Pattern.compile(".*\\.html");
        return reflections.getResources(templatePattern);
    }

    private DocumentBuilder constructDocumentBuilder() {
        DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
        try {
            dbf.setFeature(XMLConstants.FEATURE_SECURE_PROCESSING, true);
            DocumentBuilder db = dbf.newDocumentBuilder();
            db.setEntityResolver(this);
            return db;
        } catch (ParserConfigurationException e) {
            throw new AssertionError("Unable to configure a DocumentBuilder.", e);
        }
    }

    /**
     * Constructs xpaths for the description and title.
     */
    private void constructXPaths() {
        XPathFactory xpf = XPathFactory.newInstance();
        XPath xpath = xpf.newXPath();
        try {
            titlePath = xpath.compile("/html/head/title");
            descriptionPath = xpath.compile("/html/head/meta[@name='description']/@content");
        } catch (XPathExpressionException e) {
            throw new AssertionError("Unable to configure xpath to description.", e);
        }
    }

    /**
     * Indexes a particular topic and returns a {@link List} of {@link LinkData} for the topic.
     *
     * @param topic The topic to index.
     * @return A {@link List} of {@link LinkData} for the topic.
     */
    public List<LinkData> index(String topic) {
        Set<String> maths = getTopicResources(topic);
        List<LinkData> links = new ArrayList<>();
        for (String resource : maths) {
            try (InputStream is = this.getClass().getResourceAsStream("/" + resource)) {
                LinkData linkData = getLinkData(resource, is);
                links.add(linkData);
            } catch (IOException e) {
                Logger.getLogger(TopicIndexer.class)
                        .warn("Wasn't able to index the article " + resource, e);
            }
        }
        Collections.sort(links);
        return links;
    }

    /**
     * Constructs a new {@link LinkData} object representing the html article represented by the input stream.
     *
     * @param resource The location of the article in the templates/&lt;topic&gt; resource location.
     * @param is       The input stream giving access to an html article with a description + title.
     * @return A new {@link LinkData} object for the article.
     * @throws IOException if the article cannot be read for any reason.
     */
    private LinkData getLinkData(String resource, InputStream is) throws IOException {
        try {
            Document doc = documentBuilder.parse(is);
            LinkData linkData = new LinkData();
            linkData.setAddress(resource.replace("templates", ""));
            linkData.setTitle(titlePath.evaluate(doc));
            linkData.setDescription(descriptionPath.evaluate(doc));
            return linkData;
        } catch (SAXException | XPathExpressionException e) {
            throw new IOException(e);
        }
    }

    /**
     * Returns the available html resources applicable to a particular topic. Any index.html file is ignored.
     *
     * @param topic The topic to return resources for.
     * @return The list of non index.html resources.
     */
    private Set<String> getTopicResources(String topic) {
        return HTML_RESOURCES.stream()
                .filter(resource -> resource.contains("templates/" + topic + "/"))
                .filter(resource -> !resource.contains("index.html"))
                .collect(Collectors.toSet());
    }

    @Override
    public InputSource resolveEntity(String publicId, String systemId) throws SAXException, IOException {
        String file = extractLastSlash(systemId);
        String location = getLocation(file);
        InputStream is = org.thymeleaf.spring4.SpringTemplateEngine.class.
                getResourceAsStream(location);
        return new InputSource(is);
    }

    /**
     * Returns the full resource location (in the thymeleaf artifacts) to a DTD or related file.
     *
     * @param file The particular dtd or mod to retrieve.
     * @return the full location in the resources that contains the file.
     */
    private String getLocation(String file) {
        String location;
        if (file.contains("spring4")) {
            location = THYMELEAF_SPRING_DTD_BASEPATH + file;
        } else {
            location = THYMELEAF_DTD_BASEPATH + file;
        }
        return location;
    }

    /**
     * Extracts the filename part (the dtd or mod part) of a URL to resolve.
     *
     * @param systemId The system id of the entity to resolve.
     * @return The filename part of the url (the last part excluding the last slash).
     */
    private String extractLastSlash(String systemId) {
        int lastSlash = systemId.lastIndexOf('/');
        return systemId.substring(lastSlash + 1);
    }
}
