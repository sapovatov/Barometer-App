// Your code here!
jQuery(document).ready(function () {
    var main_arrow = jQuery("#Main");


    function rotation(element, r_value, speed, delay, ease_value) {

        if (ease_value == 1) {
            TweenLite.to(element, (speed) ? speed : 1, {
                attr: { transform: "rotate(" + r_value + ", 250 250)" }, delay: delay, ease: Back.easeOut.config(1), y: -10
            });
        }
        else if (ease_value == 2) {
            TweenLite.to(element, (speed) ? speed : 1, {
                attr: { transform: "rotate(" + r_value + ", 250 250)" }, delay: delay, ease: Power3.easeInOut, y: -500
            });
        }
        else {
            TweenLite.to(element, (speed) ? speed : 1, {
                attr: { transform: "rotate(" + r_value + ", 250 250)" }, delay: delay
            });
        }
    };

    jQuery("#Button").bind("tap", function (e) {
        console.log("Tap event");
    });

});
