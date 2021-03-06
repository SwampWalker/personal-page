/**
 * Created by atonita on 2016-01-16.
 */

FormValidating = {
    WHOLE_NUMBER_REGEXP: /^\d+$/,
    /**
     * Gets a non-negative integer out of a form element, or doesn't return anything. If the value of the form is not an integer,
     * the has-error class is added to it, otherwise has-error is removed.
     *
     * @param selector The DOM selector to pass to jquery and get the value of
     * @returns {Number} The integer in the form element or no return.
     */
    getWholeNumber: function (selector) {
        var value = $(selector).val();
        if (this.WHOLE_NUMBER_REGEXP.test(value) && value !== '') {
            $(selector).parent().removeClass('has-error');
            return parseInt(value);
        } else {
            $(selector).parent().addClass('has-error');
        }
    },
    FLOAT_REGEXP: /^[-+]?\d*\.?\d*([eE][-+]?\d+)?$/,
    /**
     * Gets a float out of a form element, or doesn't return anything. If the value of the form is not a float,
     * the has-error class is added to it, otherwise has-error is removed.
     *
     * @param selector The DOM selector to pass to jquery and get the value of
     * @returns {Number} The float in the form element or no return.
     */
    getFloat: function (selector) {
        var value = $(selector).val();
        if (this.FLOAT_REGEXP.test(value) && value !== '') {
            $(selector).parent().removeClass('has-error');
            return parseFloat(value);
        } else {
            $(selector).parent().addClass('has-error');
        }
    }
}