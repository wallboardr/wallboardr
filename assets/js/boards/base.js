define(['jquery', 'lib/bigtext'], function ($) {
    'use strict';
    
    var $screen = $('.screen'),
        $local = $('.local-message:visible'),
        centerMessage = function ($outer, $inner) {
            var outerHeight = $outer.height(),
                innerHeight = $inner.height(),
                marginTop = (outerHeight - innerHeight) / 2;
            $inner.css({'margin-top': marginTop + 'px'});
        },
        init = function () {
            $local.bigtext();
            centerMessage($screen, $local);
        };

    return {
        bootstrap: init
    };
});