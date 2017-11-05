// Your code here!
jQuery(document).ready(function () {
    var main_arrow = jQuery("#Main");
    TweenLite.to(main_arrow, 1, {
        attr: {
            transform:"rotate(60, 250 250)"
        }
    });
});