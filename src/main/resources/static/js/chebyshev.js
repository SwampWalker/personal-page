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
    },

    /**
     * The matrix M that converts the vector of values u to coefficients a:
     * Mu=a. See Boyd, Chebyshev and Fourier spectral methods, eq 5.37 pg 124.
     * The coefficients are also implied by 4.49 and 4.50.
     *
     * @param N the rank of the matrix.
     */
    extremaValuesToCoefficients: function (N) {
        var x = this.extrema(N);
        var M = [[], []];
        var invRankMinus1 = 1 / (N - 1);
        // Initialize row 0 to T_0, and 1 to T_1
        for (var iColumn = 0; iColumn < N; iColumn++) {
            M[0][iColumn] = 2 * invRankMinus1;
            M[1][iColumn] = x[iColumn] * 2 * invRankMinus1;
        }
        // Use recursion relation on further rows.
        for (var iRow = 2; iRow < N; iRow++) {
            M.push([]);
            for (var iColumn = 0; iColumn < N; iColumn++) {
                M[iRow][iColumn] = 2 * x[iColumn] * M[iRow - 1][iColumn] - M[iRow - 2][iColumn];
            }
        }
        // Fix some weights.
        for (var i = 0; i < N; i++) {
            M[0][i] *= 0.5;
            M[i][0] *= 0.5;
            M[i][N - 1] *= 0.5;
            M[N - 1][i] *= 0.5;
        }
        return M;
    }
};