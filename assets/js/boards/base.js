(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(root.jQuery);
    }
}(this, function ($) {
    'use strict';
    
    var $screen = $('.screen'),
        $local = $('.local-message:visible'),
        centerMessage = function ($outer, $inner) {
            var outerHeight = $outer.height(),
                innerHeight = $inner.height(),
                marginTop = (outerHeight - innerHeight) / 2;
            $inner.css({'margin-top': marginTop + 'px'});
        };

    $local.bigtext();
    centerMessage($screen, $local);

    return {};
}));