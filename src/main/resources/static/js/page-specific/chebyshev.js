/**
 * Created by atonita on 2016-01-02.
 */

$(function () {
    var t = [];
    var maxN = 6;
    for (var i = 0; i < maxN; i++) {
        t.push([]);
    }

    var delta = 0.02;
    for (var x = -1; x < (1 + delta / 2.); x += delta) {
        for (var n = 1; n <= t.length; n++) {
            t[n - 1].push([x, ChebyshevT(n, x)]);
        }
    }

    var data = [];
    for (var n = 1; n <= t.length; n++) {
        data.push({
            data: t[n - 1],
            label: "T" + String.fromCharCode(0x2080 + n) + "(x)"
        });
    }

    $.plot("#placeholder", data);

    $(window).resize(function() {
        $.plot("#placeholder", data);
    });
});