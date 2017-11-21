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
    function control_mark() {
        var date = new Date();
        var mark_day;
        var mark_month;
        var mark_hours;
        var mark_minutes;

        this.update_date = function () {
            date = new Date();
            mark_day = date.getDate();
            mark_month = date.getMonth();
            mark_hours = date.getHours();
            mark_minutes = date.getMinutes();
        };

        this.check = function () {
            if (localStorage.mark_day) {
                return true;
            }
            else {
                return false;
            }
        };


        this.tap = function () {
            this.update_date();
            if (typeof (Storage) !== "undefined") {
                if (!this.check()) {
                    localStorage.setItem("mark_day", mark_day);
                    localStorage.setItem("mark_month", mark_month);
                    localStorage.setItem("mark_hours", mark_hours);
                    localStorage.setItem("mark_minutes", mark_minutes);

                    TweenLite.to(jQuery("#innerGlow > feFlood"), 2, { attr: { "flood-opacity": 1 } });
                    TweenLite.to(jQuery("#innerGlow > feMorphology"), 1, { attr: { radius: 0.3 } });
                    TweenLite.to(jQuery("#innerGlow > feGaussianBlur"), 2, { attr: { stdDeviation: 2 } });


                    rotation(jQuery("#Days"), -(mark_day * 11.25), 5, 0, 2);
                    rotation(jQuery("#Months"), -27.6923-(mark_month * 27.6923), 5, 0, 2);
                    rotation(jQuery("#Hours"), -14.4 - (mark_hours * 14.4), 5, 0, 2);
                    rotation(jQuery("#Minutes"), -5.9016 - (mark_minutes * 5.9016), 5, 0, 2);
                }
                else {
                    console.log("Date is already marked!!!");
                }

            } else {
                console.log("Sorry! No Web Storage support");
            };
        };
        this.taphold = function () {
            if (typeof (Storage) !== "undefined") {
                if (localStorage.mark_day) {
                    localStorage.removeItem("mark_day");
                    localStorage.removeItem("mark_month");
                    localStorage.removeItem("mark_hours");
                    localStorage.removeItem("mark_minutes");

                    TweenLite.to(jQuery("#innerGlow > feFlood"), 2, { attr: { "flood-opacity": 0 } });
                    TweenLite.to(jQuery("#innerGlow > feMorphology"), 1, { attr: { radius: 0 } });
                    TweenLite.to(jQuery("#innerGlow > feGaussianBlur"), 2, { attr: { stdDeviation: 0 } });

                    rotation(jQuery("#Days"), 0, 5, 0, 2);
                    rotation(jQuery("#Months"), 0, 5, 0, 2);
                    rotation(jQuery("#Hours"), 0, 5, 0, 2);
                    rotation(jQuery("#Minutes"), 0, 5, 0, 2);
                }
                else {
                    console.log("Date is already removed!!!");
                };
            } else {
            console.log("Sorry! No Web Storage support");
            };
        };
        this.start = function () {
            if (typeof (Storage) !== "undefined") {
                if (localStorage.mark_day) {
                    var storage_day = localStorage.getItem("mark_day");
                    var storage_month = localStorage.getItem("mark_month");
                    var storage_hour = localStorage.getItem("mark_hours");
                    var storage_minute = localStorage.getItem("mark_minutes");

                    TweenLite.to(jQuery("#innerGlow > feFlood"), 1, { attr: { "flood-opacity": 1 } });
                    TweenLite.to(jQuery("#innerGlow > feMorphology"), 1, { attr: { radius: 0.3 } });
                    TweenLite.to(jQuery("#innerGlow > feGaussianBlur"), 1, { attr: { stdDeviation: 2 } });

                    rotation(jQuery("#Days"), -(storage_day * 11.25), 1, 0, 2);
                    rotation(jQuery("#Months"), -(storage_month * 27.6923), 1, 0, 2);
                    rotation(jQuery("#Hours"), 14.4 - (storage_hour * 14.4), 1, 0, 2);
                    rotation(jQuery("#Minutes"), 5.9016 - (storage_minute * 5.9016), 1, 0, 2);
                }
                else {
                    console.log("Storage have no data!!!");
                }
            } else {
                console.log("Sorry! No Web Storage support");
            };
        };
    };

    var set_remove_mark = new control_mark();
    var mark_set = set_remove_mark.check();
    set_remove_mark.start();
    jQuery("#Button").on("vmousedown", function (e) {
        if (!mark_set) {
            set_remove_mark.tap();
        }
        mark_set = set_remove_mark.check();
    });
    jQuery("#Button").on("taphold", function (e) {
        if (mark_set) {
            set_remove_mark.taphold();
        }
        mark_set = set_remove_mark.check();
    });

});
