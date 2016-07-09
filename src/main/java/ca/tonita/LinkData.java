package ca.tonita;

/**
 * Created by Aaryn Tonita on 2016-07-09.
 * All rights reserved.
 */
public class LinkData implements Comparable<LinkData> {
    private String title;
    private String address;
    private String description;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public int compareTo(LinkData o) {
        return title.compareTo(o.title);
    }
}
