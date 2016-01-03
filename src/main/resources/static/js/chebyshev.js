/**
 * Created by atonita on 2016-01-01.
 */

function ChebyshevT(n, x) {
    if (n <= 0) {
        return 1;
    }
    var ti = x;
    var tiMinus1 = 1;
    for (var i = 1; i < n; i++) {
        var tiPlus1 = 2*x*ti - tiMinus1;
        tiMinus1 = ti;
        ti = tiPlus1;
    }
    return ti;
};