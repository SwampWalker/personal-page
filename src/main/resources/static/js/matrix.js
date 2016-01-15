function Matrix(N) {
    this.rank = N;
    this.pivots = [];
    this.luFactored = false;

    for (var i = 0; i < N; i++) {
        this.pivots[i] = i;
        this[i] = [];
        for (var j = 0; j < N; j++) {
            this[i][j] = 0;
        }
    }
}

Matrix.prototype = new Array;

/**
 * Solves the equation Ax = b, by LU factoring then solving Ly = b, Ux = y. The input argument b is
 * replaced with the solution on exit.
 *
 * @param b The right hand side on entrance, the solution on exit.
 */
Matrix.prototype.solve = function(b) {
    if (!this.luFactored) {
        this.factorLU();
    }
    this.forwardSubstitute(b);
    this.backSubstitute(b);
    // Now we need to pivot the result.
    var x = [];
    for (var i = 0; i < x.length; i++) {
        x[i] = b[this.pivots[i]];
    }
    for (var i = 0; i < x.length; i++) {
        b[i] = x[i];
    }
}

/**
 * LU factors the matrix.
 */
Matrix.prototype.LUFactorize = function () {
    for (var iRow = 0; iRow < this.rank; iRow++) {
        this.pivot(iRow);
        var diagonal = this[this.pivots[iRow]][iRow];
        for (var iSubRow = iRow + 1; iSubRow < this.rank; iSubRow++) {
            this[this.pivots[iSubRow]][iRow] /= diagonal;
            for (var iColumn = iRow + 1; iColumn < this.rank; iColumn++) {
                this[this.pivots[iSubRow]][iColumn] -= this[this.pivots[iSubRow]][iRow] * this[this.pivots[iRow]][iColumn];
            }
        }
    }
    this.luFactored = true;
};

/**
 * Performs forward substitution assuming a lower diagonal form of this matrix. Forward substitution
 * solves the equation Ly = x, with L a lower triangular matrix (possibly pivoted) and x the input. The
 * input x is overwritten with the solution y.
 *
 * @param x The right hand side on entrance, the solution y on exit.
 */
Matrix.prototype.forwardSubstitute = function (x) {
    for (var iRow = 0; iRow < this.rank; iRow++) {
        for (var iColumn = 0; iColumn < iRow; iColumn++) {
            x[this.pivots[iRow]] -= this[this.pivots[iRow]][iColumn] * x[this.pivots[iColumn]];
        }
        if (!this.luFactored) {
            x[this.pivots[iRow]] /= this[this.pivots[iRow]][iRow];
        }
    }
};

/**
 * Solves the equation Uy = x, where U is an upper triangular matrix, using backwards substitution. The
 * input x is overwritten with the solution y.
 *
 * @param x The right hand side on entrance, the solution y on exit.
 */
Matrix.prototype.backSubstitute = function (x) {
    for (var iRow = this.rank - 1; iRow >= 0; iRow--) {
        for (var iColumn = iRow + 1; iColumn < this.rank; iColumn++) {
            x[this.pivots[iRow]] -= this[this.pivots[iRow]][iColumn] * x[this.pivots[iColumn]];
        }
        x[this.pivots[iRow]] /= this[this.pivots[iRow]][iRow];
    }
};

/**
 * Finds the element in rows i through n that is greates in absolute size and pivots the
 * matrix so that that element is in the main diagonal.
 *
 * @param i The index of the row/column to pivot a row into.
 */
Matrix.prototype.pivot = function (i) {
    var max = Math.abs(this[this.pivots[i]][i]);
    var indexOfMax = i;
    for (var j = i + 1; j < this.rank; j++) {
        var magnitude = Math.abs(this[this.pivots[j]][i]);
        if (magnitude > max) {
            max = magnitude;
            indexOfMax = j;
        }
    }
    // Interchange rows in permutation vector
    var oldIndex = this.pivots[i];
    this.pivots[i] = this.pivots[indexOfMax];
    this.pivots[indexOfMax] = oldIndex;
};

Matrix.prototype.copy = function (a) {
    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < a[i].length; j++) {
            this[i][j] = a[i][j];
        }
    }
};

Matrix.prototype.print = function () {
    for (var i = 0; i < this.rank; i++) {
        console.log(this[i].toString());
    }
};

testMatrix = new Matrix(4);
testMatrix.copy([
    [2, 1, 1, 0],
    [4, 3, 3, 1],
    [8, 7, 9, 5],
    [6, 7, 9, 8]]);

luMatrix = new Matrix(4);
luMatrix.copy([
    [1. / 4, -3. / 7, 1. / 3, 2. / 3],
    [1. / 2, -2. / 7, -6. / 7, -2. / 7],
    [8, 7, 9, 5],
    [3. / 4, 7. / 4, 9. / 4, 17. / 4]
]);

uMatrix = new Matrix(5);
uMatrix.copy([
    [5, 1, 2, 3, 4],
    [0, 4, 1, 2, 3],
    [0, 0, 3, 1, 2],
    [0, 0, 0, 2, 1],
    [0, 0, 0, 0, 1]
]);