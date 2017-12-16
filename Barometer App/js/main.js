﻿// Your code here!

jQuery(document).ready(function () {


    var window_height = jQuery(window).height();

    var light_color = "#0077ff";
    var main_arrow = jQuery("#Main");

    reposition(1);

    //positioning
    var window_width = jQuery(window).width();
    if (window_width < 500) {
        var width_delta = 500 - window_width;
        var new_width = (500 - width_delta) - (((500 - width_delta) * 2) / (100));
        var coef = ((100 * new_width) / 500) / 100;
        reposition(coef);
    }

    function reposition(coeficient) {
        jQuery("#barometer").css({ "top": (jQuery(window).height() - jQuery("#barometer").height())/2 + "px" })
        jQuery("#minutes").css({ "width": jQuery("#minutes").width() * coeficient + "px", "height": jQuery("#minutes").height() * coeficient + "px" });
        jQuery("#hours").css({ "width": jQuery("#hours").width() * coeficient + "px", "height": jQuery("#hours").height() * coeficient + "px" });
        jQuery("#months").css({ "width": jQuery("#months").width() * coeficient + "px", "height": jQuery("#months").height() * coeficient + "px" });
        jQuery("#days").css({ "width": jQuery("#days").width() * coeficient + "px", "height": jQuery("#days").height() * coeficient + "px" });
        jQuery("#main_arrow").css({ "width": jQuery("#main_arrow").width() * coeficient + "px", "height": jQuery("#main_arrow").height() * coeficient + "px" });
        jQuery("#main_arrow_body").css({ "borderBottomWidth": parseInt(jQuery("#main_arrow_body").css("borderBottomWidth"), 10) * coeficient + "px", "borderLeftWidth": parseInt(jQuery("#main_arrow_body").css("borderLeftWidth"), 10) * coeficient + "px", "borderRightWidth": parseInt(jQuery("#main_arrow_body").css("borderRightWidth"), 10) * coeficient + "px" });
        jQuery("#main_arrow_tale").css({ "borderTopWidth": parseInt(jQuery("#main_arrow_tale").css("borderTopWidth"), 10) * coeficient + "px" });
        jQuery("#statistic_arrow").css({ "borderBottomWidth": parseInt(jQuery("#statistic_arrow").css("borderBottomWidth"), 10) * coeficient + "px", "borderLeftWidth": parseInt(jQuery("#statistic_arrow").css("borderLeftWidth"), 10) * coeficient + "px", "borderRightWidth": parseInt(jQuery("#statistic_arrow").css("borderRightWidth"), 10) * coeficient + "px" });
        jQuery("#button").css({ "width": jQuery("#button").width() * coeficient + "px", "height": jQuery("#button").height() * coeficient + "px" });
    };


    //barometer part
    var desiredReportIntervalMs = 0;
    var barometer;
    var barometer_value;

    barometer = Windows.Devices.Sensors.Barometer.getDefault();
    if (barometer) {
        // Select a report interval that is both suitable for the purposes of the app and supported by the sensor.
        // This value will be used later to activate the sensor.
        var minReportIntervalMs = barometer.minReportIntervalMs;
        desiredReportIntervalMs = minReportIntervalMs > 1000 ? minReportIntervalMs : 1000;


            if (jQuery("#main_page").hasClass("ui-page-active")) {
                // Re-enable sensor input. No need to restore the desired desiredReportIntervalMs (it is restored for us upon app resume)
                barometer.addEventListener("readingchanged", onBarometerDataChanged);
            } else {
                // Disable sensor input. No need to restore the default desiredReportIntervalMs (resources will be released upon app suspension)
                barometer.removeEventListener("readingchanged", onBarometerDataChanged);
            };
    }
    else {
        console.log("No barometer!");
    }
    
    function onBarometerDataChanged(e) {
        var reading = e.reading;
        barometer_value = e.reading.stationPressureInHectopascals.toFixed(2);

        rotation(jQuery("#main_arrow"), ((barometer_value - 1010) * 2.43), 1, 1);
    }

    function rotation(element, r_value, speed, type) {

        if (type == 1) {
            jQuery(element).css({ "transform": "rotate(" + r_value + "deg) translate(-50%, -50%)", "transition": "transform cubic-bezier(0.175, 0.885, 0.32, 1.275) " + speed + "s" });
        }
        else if (type == 2) {
            jQuery(element).css({ "transform": "rotate(" + r_value + "deg) translate(-50%, -50%)", "transition": "all ease-out " + speed + "s" });
        }
        else {
            jQuery(element).css({ "transform": "rotate(" + r_value + "deg) translate(-50%, -50%)", "transition": "transform linear " + speed + "s" });
        }
       
    }
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
        }


        this.tap = function () {
            this.update_date();
            if (typeof (Storage) !== "undefined") {
                if (!this.check()) {
                    localStorage.setItem("mark_day", mark_day);
                    localStorage.setItem("mark_month", mark_month);
                    localStorage.setItem("mark_hours", mark_hours);
                    localStorage.setItem("mark_minutes", mark_minutes);
                    localStorage.setItem("mark_preasure", barometer_value);

                    jQuery("#lighting").css({ "boxShadow": "inset 0px 0px 5px 3px" + light_color, "transition": "all linear 1.5s"});

                    rotation(jQuery("#days"), -(mark_day * 11.25), 3, 3);
                    rotation(jQuery("#months"), -27.6923-(mark_month * 27.6923), 3, 3);
                    rotation(jQuery("#hours"), -14.4-(mark_hours * 14.4), 3, 3);
                    rotation(jQuery("#minutes"), -5.9016-(mark_minutes * 5.9016), 3, 3);
                    rotation(jQuery("#statistic_arrow"), ((barometer_value - 1010) * 2.43), 3, 1);
                    jQuery("#statistic_arrow").css({"opacity":"1"});
                    
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

                    jQuery("#lighting").css({ "boxShadow": "inset 0px 0px 0px 0px" + light_color, "transition": "all linear 1.5s" });

                    rotation(jQuery("#days"), 0, 3, 3);
                    rotation(jQuery("#months"), 0, 3, 3);
                    rotation(jQuery("#hours"), 0, 3, 3);
                    rotation(jQuery("#minutes"), 0, 3, 3);
                    rotation(jQuery("#statistic_arrow"), 0, 3, 2);
                    jQuery("#statistic_arrow").css({ "opacity": "0" });

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
                    var storage_preasure = localStorage.getItem("mark_preasure");

                    jQuery("#lighting").css({ "boxShadow": "inset 0px 0px 5px 3px" + light_color });

                    rotation(jQuery("#days"), -(storage_day * 11.25), 0, 3);
                    rotation(jQuery("#months"), -27.6923-(storage_month * 27.6923), 0, 3);
                    rotation(jQuery("#hours"), -14.4 - (storage_hour * 14.4), 0, 3);
                    rotation(jQuery("#minutes"), -5.9016 - (storage_minute * 5.9016), 0, 3);
                    rotation(jQuery("#statistic_arrow"), ((storage_preasure - 1010) * 2.43), 0, 3);
                    jQuery("#statistic_arrow").css({ "opacity": "1" });
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
    jQuery("#button").on("vmousedown", function (e) {
        if (!mark_set) {
            set_remove_mark.tap();
        }
        mark_set = set_remove_mark.check();
    });
    jQuery("#button").on("taphold", function (e) {
        if (mark_set) {
            set_remove_mark.taphold();
        }
        mark_set = set_remove_mark.check();
    });

});
