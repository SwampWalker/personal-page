(function () {
    var nextNumber = 1;
    $('.equation').each(function () {
            var text = $(this).text();
            var numbered = $(this).hasClass('numbered');
            katex.render(text, this, {displayMode: numbered});
            if (numbered) {
                $(this).data('equation-number', nextNumber);
                $(this).append('<span class="equation-number">(' + (nextNumber) + ')</span>');
                nextNumber += 1;
            }
        }
    );

    // Style equation references
    var equation_references = $('a.eqref');
    equation_references.each(function () {
        var eqref = $(this).attr('href');
        var number = $(eqref).data('equation-number');
        if (number !== undefined) {
            $(this).text('equation (' + number + ')');
        } else {
            console.log('The href attribute "' + eqref + '" of an a.eqref does not exist.');
        }
    });

    // Prepare a popup for showing referenced equations from .eqref links.
    $('body').append('<div id="__equation-popup" style="display:none; position:absolute">Popup</div>');
    var popup = $('#__equation-popup');
    popup.on("click", function (e) {
        e.stopPropagation();
    });
    $(document).click(function () {
        popup.hide("fast");
    });

    // Attach a handler for the popup to the link
    equation_references.on('mouseenter', function (evt) {
        if (!popup.is(':visible')) {
            var eqref = $(this).attr('href');
            var $eqref = $(eqref).children(':first').clone();
            popup.empty();
            popup.html($eqref);
            popup.css({left: evt.pageX + 30, top: evt.pageY - 15}).show();
        }
    });

    // TODO: allow through js or css the equations to wrap on = signs.
})();
