﻿// Your code here!

jQuery(document).ready(function () {
    var window_height = jQuery(window).height();
    jQuery("svg").css({ "transform": "translate(-50%, " + (window_height - jQuery('svg').height()) / 2 + "px" });

    jQuery("svg").animate({opacity:1}, 250);

    var light_color = "#00ffaa";
    jQuery("#innerGlow > feFlood").attr("flood-color", light_color);
    jQuery("#Statistic").css("fill", light_color);
    var main_arrow = jQuery("#Main");


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

        rotation(jQuery("#Main"), ((barometer_value - 1010) * 2.43), 1, 0, 3);
    }

    function rotation(element, r_value, speed, delay, ease_value) {

        if (ease_value == 1) {
            TweenLite.to(element, (speed) ? speed : 1, {
                attr: { transform: "rotate(" + r_value + " 250 250)" }, delay: delay, ease: Back.easeOut.config(1), y: -10
            });
        }
        else if (ease_value == 2) {
            TweenLite.to(element, (speed) ? speed : 1, {
                attr: { transform: "rotate(" + r_value + " 250 250)" }, delay: delay, ease: Power3.easeInOut, y: -500
            });
        }
        else {
            TweenLite.to(element, (speed) ? speed : 0, {
                attr: { transform: "rotate(" + r_value + " 250 250)" }, delay: delay
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
                    localStorage.setItem("mark_preasure", barometer_value);

                    TweenLite.to(jQuery("#innerGlow > feFlood"), 5, { attr: { "flood-opacity": 0.5 } });
                    TweenLite.to(jQuery("#innerGlow > feMorphology"), 4, { attr: { radius: 4 } });
                    TweenLite.to(jQuery("#innerGlow > feGaussianBlur"), 5, { attr: { stdDeviation: 4 } });

                    rotation(jQuery("#Days"), -(mark_day * 11.25), 0, 5, 3);
                    rotation(jQuery("#Months"), -27.6923-(mark_month * 27.6923), 0, 5, 3);
                    rotation(jQuery("#Hours"), -14.4 - (mark_hours * 14.4), 0, 5, 3);
                    rotation(jQuery("#Minutes"), -5.9016 - (mark_minutes * 5.9016), 0, 5, 3);
                    rotation(jQuery("#Statistic"), ((barometer_value - 1010) * 2.43), 0, 5, 3);
                    TweenLite.to(jQuery("#Statistic"), 0, { attr: { opacity: 1 } });
                    
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

                    TweenLite.to(jQuery("#innerGlow > feFlood"), 5, { attr: { "flood-opacity": 0 } });
                    TweenLite.to(jQuery("#innerGlow > feMorphology"), 4, { attr: { radius: 0 } });
                    TweenLite.to(jQuery("#innerGlow > feGaussianBlur"), 5, { attr: { stdDeviation: 0 } });

                    rotation(jQuery("#Days"), 0, 0, 5, 3);
                    rotation(jQuery("#Months"), 0, 0, 5, 3);
                    rotation(jQuery("#Hours"), 0, 0, 5, 3);
                    rotation(jQuery("#Minutes"), 0, 0, 5, 3);
                    TweenLite.to(jQuery("#Statistic"), 0, { attr: { opacity: 0 } });

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

                    TweenLite.to(jQuery("#innerGlow > feFlood"), 0, { attr: { "flood-opacity": 0.5 } });
                    TweenLite.to(jQuery("#innerGlow > feMorphology"), 0, { attr: { radius: 4 } });
                    TweenLite.to(jQuery("#innerGlow > feGaussianBlur"), 0, { attr: { stdDeviation: 4 } });

                    rotation(jQuery("#Days"), -(storage_day * 11.25), 1, 0, 2);
                    rotation(jQuery("#Months"), -27.6923-(storage_month * 27.6923), 1, 0, 2);
                    rotation(jQuery("#Hours"), -14.4 - (storage_hour * 14.4), 1, 0, 2);
                    rotation(jQuery("#Minutes"), -5.9016 - (storage_minute * 5.9016), 1, 0, 2);
                    rotation(jQuery("#Statistic"), ((storage_preasure - 1010) * 2.43), 0, 5, 3);
                    TweenLite.to(jQuery("#Statistic"), 0, { attr: { opacity: 1 } });
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
