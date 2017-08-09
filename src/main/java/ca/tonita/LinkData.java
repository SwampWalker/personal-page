package ca.tonita;

import javax.validation.constraints.NotNull;

/**
 * Created by Aaryn Tonita on 2016-07-09.
 *
 */
public class LinkData implements Comparable<LinkData> {
    private String title;
    private String address;
    private String description;

    public String getTitle() {
        return title;
    }

    public LinkData setTitle(String title) {
        this.title = title;
        return this;
    }

    public String getAddress() {
        return address;
    }

    public LinkData setAddress(String address) {
        this.address = address;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public LinkData setDescription(String description) {
        this.description = description;
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LinkData linkData = (LinkData) o;

        return title != null ? title.equals(linkData.title) : linkData.title == null;
    }

    @Override
    public int hashCode() {
        return title != null ? title.hashCode() : 0;
    }

    @Override
    public int compareTo(@NotNull LinkData o) {
        return title.compareTo(o.title);
    }
}
