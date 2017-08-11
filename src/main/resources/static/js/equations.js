(function() {
    var nextNumber = 1;
    $('span.equation').each(function () {
            var text = $(this).text();
            var numbered = $(this).hasClass('numbered');
            katex.render(text, this, {displayMode: numbered});
            if (numbered) {
                $(this).append('<span class="equation-number">(' + (nextNumber) + ')</span>');
                nextNumber += 1;
            }
        }
    );
    // TODO: allow through js or css the equations to wrap on = signs.
})();
