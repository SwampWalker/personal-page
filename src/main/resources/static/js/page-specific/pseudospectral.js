/**
 * Created by atonita on 2016-01-02.
 */

sampledChebyshev = [];
sampledChebyshevData = [];

function createSubscript(n) {
    var label = '';
    if (n === 0) {
        return String.fromCharCode(0x2080);
    }
    while (n >= 1) {
        var mod = n % 10;
        n /= 10;
        label = String.fromCharCode(0x2080 + mod) + label;
    }
    return label;
}

function sampleChebyshev() {
    var minN = FormValidating.getWholeNumber('#minN');
    var maxN = FormValidating.getWholeNumber('#maxN');
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

        $.plot("#bases", sampledChebyshevData);
    }
};

(function () {
    sampleChebyshev();
    $(window).resize(function () {
        $.plot("#bases", sampledChebyshevData);
    });
})();

function logistic(x) {
    return 2 * (1 / (1 + Math.exp(-5 * x)) - 0.5);
}

function exp(x) {
    var k = 2;
    return 2 * (Math.exp(k * x) - 0.5 * (Math.exp(k) + Math.exp(-k))) /
        (Math.exp(k) - Math.exp(-k));
}
var logisticSmooth = [];

(function () {
    // Here we compute approximations using roots and extrema.

    // Consider T_10...
    var roots = Chebyshev.roots(10);
    var extrema = Chebyshev.extrema(11);

    var T = [];
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
            label: "T" + createSubscript(10) + "(x) with roots and extrema",
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

var approximation = [];
var solutionData = null;
var actualLogisticSmooth = [];
function actualLogistic(x) {
    return 1/(1 + Math.exp(-5*x));
}

function initializeSolution() {
    var rank = FormValidating.getWholeNumber('#rank');
    var x = Chebyshev.extrema(rank);
    approximation = [];
    for (var i = 0; i < x.length; i++) {
        approximation.push([x[i], 0.5*(1 + x[i])]);
    }

    solutionData = [
        {
            data: actualLogisticSmooth,
            label: "logistic(x)"
        },
        {
            data: approximation,
            label: "approximation",
            points: {show: true}
        }
    ];

    $.plot("#solutions", solutionData);

}

function iterate() {
    var f = [];
    for (var i = 0; i < approximation.length; i++) {
        f[i] = approximation[i][1];
    }
    var d = new Matrix(approximation.length);
    d.copy(Chebyshev.extremaDiff(approximation.length));
    var df = d.vectorMultiply(f);
    var rhs = [];
    for (var i = 0; i < f.length; i++) {
        rhs.push(df[i] - 5*f[i]*(1 - f[i]));
    }
    d.addDiagonal(f, 10);
    d.addConstantToDiagonal(-5);

    // boundary condition.
    for (var i = 0 ; i < approximation.length; i++) {
        d[0][i] = 0;
    }
    d[0][0] = 1;
    rhs[0] = f[0] - actualLogistic(approximation[0][0]);

    d.solve(rhs);
    for (var i = 0; i < approximation.length; i++) {
        approximation[i][1] -= rhs[i];
    }
    $.plot("#solutions", solutionData);
}

(function () {

    var delta = 0.005;
    for (var x = -1; x < (1 + delta / 2.); x += delta) {
        actualLogisticSmooth.push([x, actualLogistic(x)]);
    }

    initializeSolution();

    $(window).resize(function () {
        $.plot("#solutions", solutionData);
    });

})();