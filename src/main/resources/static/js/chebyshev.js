/**
 * Created by atonita on 2016-01-01.
 */

Chebyshev = {
    T: function (n, x) {
        if (n <= 0) {
            return 1;
        }
        var ti = x;
        var tiMinus1 = 1;
        for (var i = 1; i < n; i++) {
            var tiPlus1 = 2 * x * ti - tiMinus1;
            tiMinus1 = ti;
            ti = tiPlus1;
        }
        return ti;
    },

    roots: function (N) {
        var x = [];
        for (var i = N; i >= 1; i--) {
            x.push(Math.cos((2 * i - 1) * Math.PI / (2 * N)));
        }
        return x;
    },

    extrema: function (N) {
        var x = [];
        for (var i = N - 1; i >= 0; i--) {
            x.push(Math.cos(i * Math.PI / (N - 1)));
        }
        return x;
    },

    extremaDiff: function (rank) {
        var x = this.extrema(rank);
        var N = x.length - 1;
        var d = [];
        for (var j = 0; j <= N; j++) {
            d.push([]);
            var cj = 1;
            if (j == 0 || j == N) {
                cj = 2;
            }
            if (j % 2 == 1) {
                cj = -cj;
            }
            for (var k = 0; k <= N; k++) {
                if (j == k && j != 0 && j != N) {
                    d[j].push(-0.5 * x[j] / (1 - x[j] * x[j]));
                } else if (j == k) {
                    d[j].push((2 * N * N + 1) / (6 * x[j]));
                } else {
                    var ck = 1;
                    if (k == 0 || k == N) {
                        ck = 2;
                    }
                    if (k % 2 == 1) {
                        ck = -ck
                    }
                    d[j].push(cj / (ck * (x[j] - x[k])));
                }
            }
        }
        return d;
    },

    rootsDiff: function (N) {
        var d = [];
        var x = this.roots(N);
        var jSign = 1;
        for (var j = 0; j < N; j++) {
            var kSign = 1;
            d.push([]);
            for (var k = 0; k < N; k++) {
                if (j == k) {
                    d[j].push(0.5 * x[j] / (1 - x[j] * x[j]));
                } else {
                    d[j].push(Math.sqrt((1 - x[k] * x[k]) / (1 - x[j] * x[j])) * jSign * kSign / (x[j] - x[k]));
                }
                kSign *= -1;
            }
            jSign *= -1;
        }
        return d;
    }
};