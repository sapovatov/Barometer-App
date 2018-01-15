// Your code here!

jQuery(document).ready(function () {


    var window_height = jQuery(window).height();

    var light_color = "#0077ff";
    var main_arrow = jQuery("#Main");

    jQuery("#lighting_color").val(light_color);

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
        jQuery("#barometer").css({ "top": (jQuery(window).height() - jQuery("#barometer").height()) / 2 + "px" })
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
    var desiredReportIntervalMs;
    var barometer;
    var barometer_value;
    
    barometer = Windows.Devices.Sensors.Barometer.getDefault();
    if (barometer) {
        // Select a report interval that is both suitable for the purposes of the app and supported by the sensor.
        // This value will be used later to activate the sensor.
        var minReportIntervalMs = barometer.minReportIntervalMs;
        desiredReportIntervalMs = minReportIntervalMs > 1000 ? minReportIntervalMs : 1000;

        function barometer_refresh() {
            if (jQuery("#main_page").hasClass("ui-page-active")) {
                // Re-enable sensor input. No need to restore the desired desiredReportIntervalMs (it is restored for us upon app resume)
                barometer.addEventListener("readingchanged", onBarometerDataChanged);
            } else {
                // Disable sensor input. No need to restore the default desiredReportIntervalMs (resources will be released upon app suspension)
                barometer.removeEventListener("readingchanged", onBarometerDataChanged);
            };
        }
        barometer_refresh();
    }
    else {
        console.log("No barometer!");
    }
    function onBarometerDataChanged(e) {
        var reading = e.reading;
        barometer_value = e.reading.stationPressureInHectopascals.toFixed(2);

        rotation(jQuery("#main_arrow"), ((barometer_value - 1010) * 2.43), 1, 1);
        details_page();
    }

    function rotation(element, r_value, speed, type) {

        if (type == 1) {
            jQuery(element).css({ "transform": "rotate(" + r_value + "deg) translate(-50%, -50%)", "transition": "all cubic-bezier(0.175, 0.885, 0.32, 1.275) " + speed + "s" });
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

        var storage_day;
        var storage_month;
        var storage_hour;
        var storage_minute;
        var storage_preasure;


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

                    jQuery("#lighting").css({ "boxShadow": "inset 0px 0px 5px 1px" + light_color, "transition": "all linear 1.5s" });
                    jQuery(".page_2_mark span:last-of-type").css({ "color": light_color });
                    rotation(jQuery("#days"), -(mark_day * 11.25), 3, 3);
                    rotation(jQuery("#months"), -27.6923 - (mark_month * 27.6923), 3, 3);
                    rotation(jQuery("#hours"), -14.4 - (mark_hours * 14.4), 3, 3);
                    rotation(jQuery("#minutes"), -5.9016 - (mark_minutes * 5.9016), 3, 3);
                    rotation(jQuery("#statistic_arrow"), ((barometer_value - 1010) * 2.43), 3, 1);
                    jQuery("#statistic_arrow").css({ "opacity": "1" });
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
                    jQuery(".page_2_mark span:last-of-type").css({ "color": "#fff" });

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

                if (localStorage.background_color) {
                    jQuery("body").attr("style", "background: " + localStorage.background_color + " !important");
                    jQuery("#background_color").val(localStorage.background_color);
                }
                if (localStorage.lighting_color) {
                    jQuery("#statistic_arrow").css({ "borderBottomColor": localStorage.lighting_color });
                    jQuery(".page_2_mark span:last-of-type").attr("style", "color: " + localStorage.lighting_color + " !important");
                    jQuery("#lighting_color").val(localStorage.lighting_color);
                    light_color = localStorage.lighting_color;
                }

                if (localStorage.shadows) {
                    jQuery("#shadows").prop({ 'checked': true });
                    jQuery("#button").css({ "filter": "drop-shadow(10px 10px 3px rgba(0, 0, 0, .25))" });
                }

                if (localStorage.mark_day) {
                    storage_day = localStorage.getItem("mark_day");
                    storage_month = localStorage.getItem("mark_month");
                    storage_hour = localStorage.getItem("mark_hours");
                    storage_minute = localStorage.getItem("mark_minutes");
                    storage_preasure = localStorage.getItem("mark_preasure");

                    jQuery("#lighting").css({ "boxShadow": "inset 0px 0px 5px 1px" + light_color });

                    rotation(jQuery("#days"), -(storage_day * 11.25), 0, 3);
                    rotation(jQuery("#months"), -27.6923 - (storage_month * 27.6923), 0, 3);
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
        this.details = function () {
            storage_day = localStorage.getItem("mark_day");
            storage_month = localStorage.getItem("mark_month");
            storage_hour = localStorage.getItem("mark_hours");
            storage_minute = localStorage.getItem("mark_minutes");
            storage_preasure = localStorage.getItem("mark_preasure");
            day = (storage_day <= 9) ? "0" + storage_day : storage_day;
            month = (storage_month <= 9) ? "0" + (Number(storage_month)+1) : (Number(storage_month)+1);
            hour = (storage_hour <= 9) ?"0" + storage_hour : storage_hour;
            minute = (storage_minute <= 9) ?"0" + storage_minute : storage_minute;
            if (localStorage.mark_day) {
                jQuery(".page_2_mark span:last-of-type").html(Math.round(storage_preasure / 1.33322387415) + " mmHg &nbsp;&nbsp;" +day+ "." +month+ " " +hour+":"+minute);
            }
            else {
                jQuery(".page_2_mark span:last-of-type").html("There no preasure mark");
            }
            jQuery(".page_2_preasure span:first-of-type").html(barometer_value + " hPa ")
            jQuery(".page_2_preasure span:last-of-type").html(Math.round(barometer_value / 1.33322387415) + " mmHg");
        };
    };

    var set_remove_mark = new control_mark();
    var mark_set = set_remove_mark.check();
    set_remove_mark.start();

    function details_page() {
        set_remove_mark.details();
    };

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

    jQuery("body").on("swipeup", function (e) {
        jQuery(".ui-navbar ul").css({ "top": "-" + jQuery(".ui-navbar").height() + "px" });
        jQuery("#settings").css({ "top": "0px", "height": (jQuery(document).height() + jQuery(".ui-navbar").height()) + "px" });
    });
    jQuery("body").on("swipedown", function (e) {
        jQuery(".ui-navbar ul").css({ "top": "0px" });
        jQuery("#settings").css({ "top": "36px", "height": "100vh" });
    });

    jQuery("body").on("swiperight", function (e) {
        if (e.swipestart.coords[0] <= 75) {
            jQuery("#settings").css({ "visibility": "visible" });
            jQuery("#settings_front").css({ "transform": "translate(0%, 0%)" });
            hide_settings();
        }
    });

    function hide_settings() {
        setTimeout(function () {
            jQuery("#settings_back").one("click", function () {
                jQuery("#settings").css({ "visibility": "hidden" });
                jQuery("#settings_front").css({ "transform": "translate(-100%, 0%)" });
            });
        }, 500);
    };

    jQuery("#settings_front").on("swipeleft", function () {
        jQuery("#settings").css({ "visibility": "hidden" });
        jQuery("#settings_front").css({ "transform": "translate(-100%, 0%)" });
    });
    jQuery(".ui-block-a").on("click", function () {
        jQuery("#settings").css({ "visibility": "visible" });
        jQuery("#settings_front").css({ "transform": "translate(0%, 0%)" });
        hide_settings();
    });

    jQuery("#page_1").on("swipeleft", function (e) {
        jQuery(".ui-block-c a").click();
    });
    jQuery("#page_2").on("swiperight", function (e) {
        if (e.swipestart.coords[0] > 75) {
            jQuery(".ui-block-b a").click();
        }
    });
    jQuery("#settings_front input").unwrap();

    jQuery("#background_color").change(function (e) {
        jQuery("body").attr("style", "background: " + this.value + " !important");
        localStorage.setItem("background_color", this.value);
    });

    jQuery("#lighting_color").change(function (e) {
        jQuery("#statistic_arrow").css({ "borderBottomColor": this.value });
        jQuery("#lighting").css({ "boxShadow": "inset 0px 0px 5px 3px" + this.value });
        light_color = this.value;
        localStorage.setItem("lighting_color", this.value);
    });

    var package = Windows.ApplicationModel.Package.current;
    var packageId = package.id;
    var version = packageId.version;
    var app_name = package.displayName;
   
    jQuery("#settings .settings_footer").html("<span>" + app_name + "</span><span>ver. " + version.major + "." + version.minor + "." + version.build + "." + version.revision + "</span>");
   
    jQuery("body").on("swipe", function () {
        barometer_refresh();
        i = 0;
    });
    jQuery("#shadows").on("click", function () {
        if (jQuery(this).is(":checked")) {
            jQuery("#button").css({ "filter": "drop-shadow(10px 10px 3px rgba(0, 0, 0, .25))" });
            localStorage.setItem("shadows", 1);
        }
        else {
            jQuery("#button").css({ "filter": "none" });
            localStorage.removeItem("shadows");
        }
    });

    //language part

    var topUserLanguage = Windows.System.UserProfile.GlobalizationPreferences.languages[0];
    var language = new Windows.Globalization.Language(topUserLanguage);
    var languageName = language.languageTag;

    if (languageName == "ru" || languageName == "ua") {
        jQuery("#months").addClass("months_ru");
    }
});