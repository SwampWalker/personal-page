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
        for (var i = N-1; i >= 0; i--) {
            x.push(Math.cos(i * Math.PI / (N-1)));
        }
        return x;
    }
};