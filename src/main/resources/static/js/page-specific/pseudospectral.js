/**
 * Created by atonita on 2016-01-02.
 */

// Here we compute the illustration of basis functions
(function () {
    var t = [];
    var maxN = 6;
    for (var i = 0; i < maxN; i++) {
        t.push([]);
    }

    var delta = 0.02;
    for (var x = -1; x < (1 + delta / 2.); x += delta) {
        for (var n = 1; n <= t.length; n++) {
            t[n - 1].push([x, Chebyshev.T(n, x)]);
        }
    }

    var data = [];
    for (var n = 1; n <= t.length; n++) {
        data.push({
            data: t[n - 1],
            label: "T" + String.fromCharCode(0x2080 + n) + "(x)"
        });
    }

    $.plot("#bases", data);

    $(window).resize(function () {
        $.plot("#bases", data);
    });
})();

(function () {
    // Here we compute approximations using roots and extrema.

    // Consider T_10...
    var roots = Chebyshev.roots(10);
    var extrema = Chebyshev.extrema(11);

    function logistic(x) {
        return 2 * (1 / (1 + Math.exp(-5 * x)) - 0.5);
    }

    function exp(x) {
        var k = 2;
        return 2 * (Math.exp(k * x) - 0.5 * (Math.exp(k) + Math.exp(-k))) /
            (Math.exp(k) - Math.exp(-k));
    }

    var T = [];
    var logisticSmooth = [];
    var expSmooth = [];
    var delta = 0.005;
    for (var x = -1; x < (1 + delta / 2.); x += delta) {
        T.push([x, Chebyshev.T(10, x)]);
        logisticSmooth.push([x, logistic(x)]);
        expSmooth.push([x, exp(x)]);
    }

    var expApproximation = [];
    var rootsOnT = [];
    for (var i = 0; i < roots.length; i++) {
        expApproximation.push([roots[i], exp(roots[i])]);
        rootsOnT.push([roots[i], Chebyshev.T(10, roots[i])]);
    }

    var logisticApproximation = [];
    var extremaOnT = [];
    for (var i = 0; i < extrema.length; i++) {
        logisticApproximation.push([extrema[i], logistic(extrema[i])]);
        extremaOnT.push([extrema[i], Chebyshev.T(10, extrema[i])]);
    }

    var data = [
        {
            label: "T" + String.fromCharCode(0x2081) + String.fromCharCode(0x2080) + "(x) with roots and extrema",
            data: T,
            color: 0
        },
        {
            data: extremaOnT,
            points: {show: true},
            color: 0
        },
        {
            data: rootsOnT,
            points: {show: true},
            color: 0
        },
        {
            label: "exp(x) evaluated on roots, centred",
            data: expApproximation,
            points: {show: true},
            color: 1
        },
        {
            data: expSmooth,
            color: 1
        },
        {
            label: "logistic(x) evaluated on extrema, centred",
            data: logisticApproximation,
            points: {show: true},
            color: 2
        },
        {
            data: logisticSmooth,
            color: 2
        }
    ];

    $.plot("#collocations", data);

    $(window).resize(function () {
        $.plot("#collocations", data);
    });
})();