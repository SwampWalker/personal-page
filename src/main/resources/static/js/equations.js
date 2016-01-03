/**
 * Created by atonita on 2016-01-02.
 */
(function () {
    var Equations = Class.extend({
        init: function () {
            $('.numbered-equation').each(function (index, element) {
                $(element)
                    .wrap('<div></div>')
                    .after('<span class="equation-numbering">(' + (index + 1) + ')</span>');
            });
        }
    });

    $(document).ready(function () {
        var equationsMod = new Equations();

        // Center the equation numbers.
        $("img.numbered-equation").one("load", function () {
            var parentHeight = $(this).parent().height();
            $(this).next().css('line-height', parentHeight + "px");
        }).each(function () {
            if (this.complete) $(this).load();
        });
    });
})();