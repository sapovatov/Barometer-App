// Your code here!

jQuery(document).ready(function () {

    var resourceLoader = new Windows.ApplicationModel.Resources.ResourceLoader();
    var applicationData = Windows.Storage.ApplicationData.current.localSettings;

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
            if (applicationData.values["mark_day"]) {
                return true;
            }
            else {
                return false;
            }
        }

        this.tap = function () {
            this.update_date();
            if (!this.check()) {
                applicationData.values["mark_day"] = mark_day;
                applicationData.values["mark_month"] = mark_month;
                applicationData.values["mark_hours"] = mark_hours;
                applicationData.values["mark_minutes"] = mark_minutes;
                applicationData.values["mark_preasure"] =  barometer_value;

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

        };
        this.taphold = function () {
            
            if (applicationData.values["mark_day"]) {
                applicationData.values.remove("mark_day");
                applicationData.values.remove("mark_month");
                applicationData.values.remove("mark_hours");
                applicationData.values.remove("mark_minutes");

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
        };
        this.start = function () {

            if (applicationData.values["background_color"]) {
                jQuery("body").attr("style", "background: " + applicationData.values["background_color"] + " !important");
                jQuery("#background_color").val(applicationData.values["background_color"]);
            }
            if (applicationData.values["lighting_color"]) {
                jQuery("#statistic_arrow").css({ "borderBottomColor": applicationData.values["lighting_color"] });
                jQuery(".page_2_mark span:last-of-type").attr("style", "color: " + applicationData.values["lighting_color"] + " !important");
                jQuery("#lighting_color").val(applicationData.values["lighting_color"]);
                light_color = applicationData.values["lighting_color"];
            }

            if (applicationData.values["shadows"]) {
                jQuery("#shadows").prop({ 'checked': true });
                jQuery("#button").css({ "filter": "drop-shadow(10px 10px 3px rgba(0, 0, 0, .25))" });
            }

            if (applicationData.values["mark_day"]) {
                storage_day = applicationData.values["mark_day"];
                storage_month = applicationData.values["mark_month"];
                storage_hour = applicationData.values["mark_hours"];
                storage_minute = applicationData.values["mark_minutes"];
                storage_preasure = applicationData.values["mark_preasure"];

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
        };
        this.details = function () {
            storage_day = applicationData.values["mark_day"];
            storage_month = applicationData.values["mark_month"];
            storage_hour = applicationData.values["mark_hours"];
            storage_minute = applicationData.values["mark_minutes"];
            storage_preasure = applicationData.values["mark_preasure"];
            day = (storage_day <= 9) ? "0" + storage_day : storage_day;
            month = (storage_month <= 9) ? "0" + (Number(storage_month)+1) : (Number(storage_month)+1);
            hour = (storage_hour <= 9) ?"0" + storage_hour : storage_hour;
            minute = (storage_minute <= 9) ?"0" + storage_minute : storage_minute;
            if (applicationData.values["mark_day"]) {
                jQuery(".page_2_mark span:last-of-type").html(Math.round(storage_preasure / 1.33322387415) + " mmHg &nbsp;&nbsp;" +day+ "." +month+ " " +hour+":"+minute);
            }
            else {
                jQuery(".page_2_mark span:last-of-type").html(resourceLoader.getString('noMark'));
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
    jQuery("#settings_btn").on("click", function () {
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

    jQuery("#background_color").change(function (e) {
        jQuery("body").attr("style", "background: " + this.value + " !important");
        applicationData.values["background_color"] =  this.value;
    });

    jQuery("#lighting_color").change(function (e) {
        jQuery("#statistic_arrow").css({ "borderBottomColor": this.value });
        jQuery("#lighting").css({ "boxShadow": "inset 0px 0px 5px 3px" + this.value });
        light_color = this.value;
        applicationData.values["lighting_color"] = this.value;
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
            applicationData.values["shadows"] =  true;
        }
        else {
            jQuery("#button").css({ "filter": "none" });
            applicationData.values.remove("shadows");
        }
    });

    //language part

    var topUserLanguage = Windows.System.UserProfile.GlobalizationPreferences.languages[0];
    var language = new Windows.Globalization.Language(topUserLanguage);
    var languageName = language.languageTag;
    var lang;

    if (languageName == "ru" || languageName == "ua") {
        jQuery("#months").addClass("months_ru");
        lang = "ru";
    }
    else{
        lang = "en";
    }
    translate();
    function translate() {
        
            jQuery("#main_page ul li:nth-of-type(2)>a").html(resourceLoader.getString('barometer'));
            jQuery("#main_page ul li:nth-of-type(3)>a").html(resourceLoader.getString('detailInformation'));
            jQuery(".settings_item:nth-of-type(1) label").html(resourceLoader.getString('backgroundColor'));
            jQuery(".settings_item:nth-of-type(2) label").html(resourceLoader.getString('lightingColor'));
            jQuery(".settings_item:nth-of-type(3) label").html(resourceLoader.getString('shadows'));
            jQuery(".page_2_preasure h3").html(resourceLoader.getString('airPreasure'));
            jQuery(".page_2_mark h3").html(resourceLoader.getString('preasureMark'));
            jQuery(".page_2_forecast h3").html(resourceLoader.getString('weatherForecast'));

       
    }

    /*-----------------------------------------------BACKGROUND TASKS--------------------------------------*/

    /*registration (Main)*/

    var taskRegistered = false;
    var exampleTaskName = "barometerBackgroundTask";
    var background = Windows.ApplicationModel.Background;

    var iter1 = background.BackgroundTaskRegistration.allTasks.first();

    var trigger = new Windows.ApplicationModel.Background.TimeTrigger(15, false);

    while (iter1.hasCurrent) {

        var task1 = iter1.current.value;

        if (task1.name === exampleTaskName) {
            console.log(task1.name);
            taskRegistered = true;
            break;
        }

        iter1.moveNext();
    }
    jQuery(".page_2_forecast span").html("start: " + taskRegistered);

    jQuery(".page_2_preasure span:first-of-type").on("click", function () {


        if (taskRegistered != true) {
            var access = background.BackgroundExecutionManager.requestAccessAsync().done(function (result) {

                var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();

                               
                builder.name = exampleTaskName;
                builder.taskEntryPoint = "js\\barometerBackgroundTask.js";
                builder.setTrigger(trigger);

                var task = builder.register();

                taskRegistered = true;
                console.log("async:" + result);
                jQuery(".page_2_forecast span").html("reg: " + taskRegistered);

            });
        }
        console.log("register" + " " +Windows.ApplicationModel.Background.BackgroundExecutionManager.getAccessStatus());
    });

    jQuery(".page_2_preasure span:last-of-type").on("click", function () {

        var iter = background.BackgroundTaskRegistration.allTasks.first();
        while (iter.hasCurrent) {

            var task = iter.current.value;

            if (task.name === exampleTaskName) {
                console.log("unregister:"+task.name);
                task.unregister(true);
                taskRegistered = false;
                jQuery(".page_2_forecast span").html("unreg: "+taskRegistered);
                break;
            }

            iter.moveNext();
        }
    });

    /*registration (Toast)*/

    var taskRegistered2 = false;
    var exampleTaskName2 = "barometerBackgroundToastTask";
    var background2 = Windows.ApplicationModel.Background;


    var iter2 = background.BackgroundTaskRegistration.allTasks.first();

    var trigger2 = new Windows.ApplicationModel.Background.ToastNotificationActionTrigger();

    while (iter2.hasCurrent) {

        var task2 = iter2.current.value;

        if (task2.name === exampleTaskName2) {
            taskRegistered2 = true;
            break;
        }

        iter2.moveNext();
    }

    if (taskRegistered2 != true) {
        var access2 = background.BackgroundExecutionManager.requestAccessAsync().done(function (result) {

            var builder2 = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();


            builder2.name = exampleTaskName2;
            builder2.taskEntryPoint = "js\\barometerBackgroundTask.js";
            builder2.setTrigger(trigger2);

            var task2 = builder2.register();

            taskRegistered2 = true;

        });
    }
/*
    var iter2 = background.BackgroundTaskRegistration.allTasks.first();
    while (iter2.hasCurrent) {

        var task2 = iter.current.value;

        if (task2.name === exampleTaskName) {
            console.log("unregister:" + task.name);
            task2.unregister(true);
            taskRegistered2 = false;
            break;
        }

        iter2.moveNext();
    }
    */
    //-----------------------------------CLEAR BADGE--------------------------------
    var badgeUpdater = Windows.UI.Notifications.BadgeUpdateManager.createBadgeUpdaterForApplication();
    badgeUpdater.clear();

    //----------------------------------TOAST ACTIONS----------------------------------
    Windows.UI.WebUI.WebUIApplication.addEventListener("activated", onActivated);
    function onActivated(e) {
        console.log("action: " + e.argument);
        
    };
    

});