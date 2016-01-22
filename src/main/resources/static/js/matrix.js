function Matrix(N) {
    this.pivots = [];
    this.luFactored = false;
    this.rank = N;
    this.length = N;

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
Matrix.prototype.solve = function (b) {
    if (!this.luFactored) {
        this.LUFactorize();
    }
    this.forwardSubstitute(b);
    this.backSubstitute(b);
    // Now we need to pivot the result.
    var x = [];
    for (var i = 0; i < this.rank; i++) {
        x[i] = b[this.pivots[i]];
    }
    for (var i = 0; i < x.length; i++) {
        b[i] = x[i];
    }
};

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

/**
 * Copies a matrix into this.
 *
 * @param a The matrix to copy the data of.
 */
Matrix.prototype.copy = function (a) {
    for (var i = 0; i < a.length; i++) {
        for (var j = 0; j < a[i].length; j++) {
            this[i][j] = a[i][j];
        }
    }
};

/**
 * Adds another matrix b, to this. Optionally a constant c may be provided to multiply the matrix b by. At the end
 * this matrix will be equal to this + c*b. The input matrix b is unchanged.
 *
 * @param b The matrix b to add to this.
 * @param c The constant c to multiply b by before adding.
 */
Matrix.prototype.add = function (b, c) {
    if (typeof(c) === 'undefined') c = 1;
    for (var iRow = 0; iRow < this.rank; iRow++) {
        for (var iColumn = 0; iColumn < this[iRow].length; iColumn++) {
            this[iRow][iColumn] += c * b[iRow][iColumn];
        }
    }
};

/**
 * Adds a diagonal matrix d, to this. Optionally a constant c may be provided to multiply the matrix d by. At the end
 * this matrix will be equal to this + c*d. The input matrix d is unchanged.
 *
 * @param d The matrix d to add to this.
 * @param c The constant c to multiply b by before adding.
 */
Matrix.prototype.addDiagonal = function (d, c) {
    if (typeof(c) === 'undefined') c = 1;
    for (var iRow = 0; iRow < this.rank; iRow++) {
        this[iRow][iRow] += c * d[iRow];
    }
}

/**
 * Adds a constant to the main diagonal of this matrix.
 *
 * @param c The constant c to add to the diagonal.
 */
Matrix.prototype.addConstantToDiagonal = function (c) {
    for (var iRow = 0; iRow < this.rank; iRow++) {
        this[iRow][iRow] += c ;
    }
};

/**
 * Performs matrix vector multiplication: Ax = b, returns b.
 * @param x The vector x to multiply by this.
 */
Matrix.prototype.vectorMultiply = function (x) {
    var b = [];
    for (var iRow = 0; iRow < this.rank; iRow++) {
        var value = 0;
        for (var iColumn = 0; iColumn < x.length; iColumn++) {
            value += this[iRow][iColumn]*x[iColumn];
        }
        b.push(value);
    }
    return b;
};

/**
 * Prints this matrix to screen.
 */
Matrix.prototype.print = function () {
    for (var i = 0; i < this.rank; i++) {
        console.log(this[i].toString());
    }
};