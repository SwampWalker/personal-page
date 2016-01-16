/**
 * Created by atonita on 2016-01-02.
 */

sampledChebyshev = [];
sampledChebyshevData = [];
basesPlot = null;

function createSubscript (n) {
    var label  = '';
    while (n >= 1) {
        var mod = n % 10;
        n /= 10;
        label = String.fromCharCode(0x2080 + mod) + label;
    }
    return label;
}

function sampleChebyshev() {
    var minN = FormValidating.getInt('#minN');
    var maxN = FormValidating.getInt('#maxN');
    var delta = FormValidating.getFloat('#delta');
    if (typeof(minN) !== 'undefined' && typeof(maxN) !== 'undefined' && typeof(delta) !== 'undefined') {
        sampledChebyshev = [];
        for (var i = minN; i <= maxN; i++) {
            sampledChebyshev.push([]);
        }
        for (var x = -1; x < (1 + delta / 2.); x += delta) {
            for (var n = minN; n <= maxN; n++) {
                sampledChebyshev[n - minN].push([x, Chebyshev.T(n, x)]);
            }
        }
        sampledChebyshevData = [];
        for (var n = minN; n <= maxN; n++) {
            sampledChebyshevData.push({
                data: sampledChebyshev[n - minN],
                label: "T" + createSubscript(n) + "(x)"
            });
        }
        if (basesPlot == null) {
            $.plot("#bases", sampledChebyshevData);
        } else {
            basesPlot.setData(sampledChebyshevData);
        }
    }
};

(function () {
    sampleChebyshev();
    $(window).resize(function () {
        if (basesPlot == null) {
            $.plot("#bases", sampledChebyshevData);
        } else {
            basesPlot.setData(sampledChebyshevData);
        }
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
            color: 2
        },
        {
            data: rootsOnT,
            points: {show: true},
            color: 1
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