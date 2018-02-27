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

    //-----------------------------NAVIGATION PART----------------------------------//
    var direction;
    var mainPage = document.getElementById("main_page");
    var mainPageManager = new Hammer.Manager(mainPage);
    var swipeManager = new Hammer.Manager(mainPage);
    var pan = new Hammer.Pan();
    var swipe = new Hammer.Swipe();
    mainPageManager.add(pan);
    swipeManager.add(swipe);
    swipeManager.on("swipeup swipedown", function (e) {
        if (e.type == "swipeup") {
            jQuery("nav").css({ "top": "-" + jQuery("nav").height() + "px" });
            jQuery("#settings").css({ "top": "0px", "height": (jQuery(document).height() + jQuery("nav").height()) + "px" });
        }
        else if (e.type == "swipedown") {
            jQuery("nav").css({ "top": "0px" });
            jQuery("#settings").css({ "top": "36px", "height": "100vh" });
        };
    });
    mainPageManager.on("panright panleft panend", function (e) {
        if (((e.center.x - e.deltaX) >= 75)) {
            if (e.type == "panleft" && !(jQuery(".lastTab").hasClass("activeTab"))) {
                jQuery("body").scrollLeft(e.distance);
                direction = e.direction;
            }
            else if (e.type == "panright" && e.deltaX < 0 && !(jQuery(".lastTab").hasClass("activeTab"))) {
                jQuery("body").scrollLeft(e.distance);
            }
            else if (e.type == "panright" && !(jQuery(".middleTab").hasClass("activeTab"))) {
                jQuery("body").scrollLeft(jQuery("body").width() - e.distance);
                direction = e.direction;
            }
            else if (e.type == "panleft" && e.deltaX > 0 && !(jQuery(".middleTab").hasClass("activeTab"))) {
                jQuery("body").scrollLeft(jQuery("body").width() - e.distance);
            };
            if (e.type == "panend") {
                if ((direction == 2 && (e.distance >= (jQuery("body").width() * 0.3)) && !(jQuery(".lastTab").hasClass("activeTab"))) || (direction == 2 && !(jQuery(".lastTab").hasClass("activeTab")) && e.velocityX <= -1)) {
                    jQuery("body").scrollLeft(jQuery("body").width());
                    jQuery(".middleTab").removeClass("activeTab");
                    jQuery(".lastTab").addClass("activeTab");
                    clearNotifications();
                }
                else if (direction == 2 && (e.distance < (jQuery("body").width() * 0.3)) && !(jQuery(".lastTab").hasClass("activeTab"))) {
                    jQuery("body").scrollLeft(0);
                }
                else if ((direction == 4 && (e.distance >= (jQuery("body").width() * 0.3)) && !(jQuery(".middleTab").hasClass("activeTab"))) || (direction == 4 && !(jQuery(".middleTab").hasClass("activeTab")) && e.velocityX >= 1)) {
                    jQuery("body").scrollLeft(0);
                    jQuery(".lastTab").removeClass("activeTab");
                    jQuery(".middleTab").addClass("activeTab");
                }
                else if (direction == 4 && (e.distance < (jQuery("body").width() * 0.3)) && !(jQuery(".middleTab").hasClass("activeTab"))) {
                    jQuery("body").scrollLeft(jQuery("body").width());
                };
            }
        }
        else if (((e.center.x - e.deltaX) < 75) && (e.deltaX <= (jQuery("#settings_front").width()))) {
            jQuery("#settings_front").css({ "left": -(jQuery("#settings_front").width() - e.deltaX) + "px", "transition": "left linear 0ms" });
            jQuery("#settings").css({ "visibility": "visible" });
            if (e.type == "panend") {
                if (e.distance >= (jQuery("#settings_front").width() * 0.3)) {
                    show_settings();
                }
                else {
                    hide_settings();
                }
            }
        }
        else if (((e.center.x - e.deltaX) < 75) && (e.deltaX > (jQuery("#settings_front").width()))) {
            if (e.type == "panend") {
                jQuery("#settings_back").one("click", function () {
                    hide_settings();
                });
            }
        };
    });
    function show_settings() {
        jQuery("#settings_front").css({ "left": "0%", "transition": "left linear 250ms" });
        jQuery("#settings").css({ "visibility": "visible"});
        jQuery("#settings_btn span:first-of-type").css({ "top": "30%" });
        jQuery("#settings_btn span:last-of-type").css({ "top": "70%" });
        mainPageManager.remove(pan);
        jQuery("#settings_back").one("click", function () {
            hide_settings();
        });
    }
    function hide_settings() {
        jQuery("#settings_front").css({ "left": "-60%", "transition": "left linear 250ms" });
        jQuery("#settings").css({ "visibility": "hidden" });
        jQuery("#settings_btn span:first-of-type").css({ "top": "35%" });
        jQuery("#settings_btn span:last-of-type").css({ "top": "65%" });
        mainPageManager.add(pan);
    };
    jQuery("#settings_btn").on("click", function () {
        show_settings();
    });
    jQuery(".middleTab").on("click", function () {
        if (!(jQuery(this).hasClass("activeTab"))) {
            jQuery(this).addClass("activeTab");
            jQuery(".lastTab").removeClass("activeTab");
        };
    });
    jQuery(".lastTab").on("click", function () {
        if (!(jQuery(this).hasClass("activeTab"))) {
            jQuery(this).addClass("activeTab");
            jQuery(".middleTab").removeClass("activeTab");
            clearNotifications();
        };
    });
    //------------------------------INTERFACE SETTINGS---------------------------------------
    jQuery("#background_color").change(function (e) {
        jQuery("body").attr("style", "background: " + this.value + " !important");
        applicationData.values["background_color"] = this.value;
    });
    jQuery("#lighting_color").change(function (e) {
        jQuery("#statistic_arrow").css({ "borderBottomColor": this.value });
        jQuery("#lighting").css({ "boxShadow": "inset 0px 0px 5px 3px" + this.value });
        light_color = this.value;
        applicationData.values["lighting_color"] = this.value;
    });
    jQuery("#shadows").on("click", function () {
        if (jQuery(this).is(":checked")) {
            jQuery("#button").css({ "filter": "drop-shadow(10px 10px 3px rgba(0, 0, 0, .25))" });
            applicationData.values["shadows"] = true;
        }
        else {
            jQuery("#button").css({ "filter": "none" });
            applicationData.values.remove("shadows");
        }
    });

    //-------------------------------NOTIFICATION SETTINGS--------------------------------------

    if (applicationData.values["showNotifications"]) {
        jQuery("#notifications").prop("checked", true);
    };
    if(applicationData.values["tileNotifications"]){
        jQuery("#tileNotifications").prop("checked", true);
    };
    jQuery("#notifications").on("click", function () {
        if (jQuery(this).is(":checked")) {
            applicationData.values["showNotifications"] = true;
            notificationsRegistration();
        }
        else {
            applicationData.values.remove("showNotifications");
            notificationsUnregister();
        }
    });
    jQuery("#tileNotifications").on("click", function () {
        if (jQuery(this).is(":checked")) {
            applicationData.values["tileNotifications"] = true;
            showNotification();
        }
        else {
            applicationData.values.remove("tileNotifications");
            Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().clear();
        }
    });
    jQuery("#defference").on("blur", function () {
        if (jQuery(this).val() > Number(jQuery(this).attr("max"))) {
            jQuery(this).val(jQuery(this).attr("max"));
        }
        else if (jQuery(this).val() < Number(jQuery(this).attr("min"))) {
            jQuery(this).val(jQuery(this).attr("min"));
        }
        applicationData.values["dirrerence"] = jQuery(this).val();
    });
    jQuery("#interval").on("change", function () {
        applicationData.values["interval"] = jQuery(this).val();
        settingsChanged();
    });

    //-------------------------------------barometer part----------------------------------------
    var desiredReportIntervalMs;
    var barometer;
    var barometer_value;
 
    barometer = Windows.Devices.Sensors.Barometer.getDefault();
    if (barometer) {
        // Select a report interval that is both suitable for the purposes of the app and supported by the sensor.
        // This value will be used later to activate the sensor.
        var minReportIntervalMs = barometer.minimumReportInterval;
        desiredReportIntervalMs = minReportIntervalMs > 1000 ? minReportIntervalMs : 1000;
        barometer.reportInterval = desiredReportIntervalMs;

        function barometer_refresh() {
            if (jQuery(".middleTab").hasClass("activeTab")) {
                // Re-enable sensor input. No need to restore the desired desiredReportIntervalMs (it is restored for us upon app resume)
                barometer.addEventListener("readingchanged", onBarometerDataChanged);
            } else {
                // Disable sensor input. No need to restore the default desiredReportIntervalMs (resources will be released upon app suspension)
                barometer.removeEventListener("readingchanged", onBarometerDataChanged);
            };
        }
        barometer_refresh();
    }
    function onBarometerDataChanged(e) {
        var reading = e.reading;
        barometer_value = e.reading.stationPressureInHectopascals.toFixed(2);

        rotation(jQuery("#main_arrow"), ((barometer_value - 1010) * 2.43), 1, 1);
        details_page();      
    };
    //-------------------------------------------------------------------------------------------------------
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
    };
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
            if (applicationData.values["dirrerence"]){
                jQuery("#defference").val(applicationData.values["dirrerence"]);
            }
            if (applicationData.values["interval"]){
                jQuery("#interval").val(applicationData.values["interval"]);
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
                jQuery(".page_2_mark span:last-of-type").html(Math.round(storage_preasure / 1.33322387415) + " " + resourceLoader.getString('mmHg')+"&nbsp;&nbsp;" +day+ "." +month+ " " +hour+":"+minute);
            }
            else {
                jQuery(".page_2_mark span:last-of-type").html(resourceLoader.getString('noMark'));
            }
            jQuery(".page_2_preasure span:first-of-type").html(barometer_value + " hPa ")
            jQuery(".page_2_preasure span:last-of-type").html(Math.round(barometer_value / 1.33322387415) + " " + resourceLoader.getString('mmHg'));
            jQuery(".page_2_forecast span:first-of-type").html(applicationData.values["tempForecast"]);
            jQuery(".page_2_forecast span:last-of-type").html(applicationData.values["downfallForecast"]);
        };
    };

    var set_remove_mark = new control_mark();
    var mark_set = set_remove_mark.check();
    set_remove_mark.start();
    function details_page() {
        set_remove_mark.details();
    };

    var barometerButton = document.getElementById("button");
    var barometerButtonManager = new Hammer.Manager(barometerButton);

    barometerButtonManager.add(new Hammer.Tap());
    barometerButtonManager.add(new Hammer.Press());

    barometerButtonManager.on("tap", function () {
        if (!mark_set) {
            set_remove_mark.tap();
        }
        mark_set = set_remove_mark.check();
    });

    barometerButtonManager.on("press", function () {
        if (mark_set) {
            set_remove_mark.taphold();
        }
        mark_set = set_remove_mark.check();
    });

    //------------------------------------footer--------------------------------------------
    var package = Windows.ApplicationModel.Package.current;
    var packageId = package.id;
    var version = packageId.version;
    var app_name = package.displayName;

    jQuery("#settings .settings_footer").html("<span>" + app_name + "</span><span>ver. " + version.major + "." + version.minor + "." + version.build + "." + version.revision + "</span>");
    jQuery("body").on("swipe", function () {
        barometer_refresh();
        i = 0;
    });

    //------------------------------------------language part---------------------------------------

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
            jQuery(".settings_item:nth-of-type(3) label:first-of-type").html(resourceLoader.getString('shadows'));
            jQuery(".settings_item:nth-of-type(4) label").html(resourceLoader.getString('notificationsSettingsHeader'));
            jQuery(".settings_item:nth-of-type(5) label:first-of-type").html(resourceLoader.getString('showNotifications'));
            jQuery(".settings_item:nth-of-type(6) label:first-of-type").html(resourceLoader.getString('difference'));
            jQuery(".settings_item:nth-of-type(7) label:first-of-type").html(resourceLoader.getString('interval'));
            jQuery(".settings_item:nth-of-type(8) label:first-of-type").html(resourceLoader.getString('tileNotifications'));
            jQuery(".page_2_preasure h3").html(resourceLoader.getString('airPreasure'));
            jQuery(".page_2_mark h3").html(resourceLoader.getString('preasureMark'));
            jQuery(".page_2_forecast h3").html(resourceLoader.getString('weatherForecast'));
    }

    /*-----------------------------------------------BACKGROUND TASKS--------------------------------------*/

    var startRegistration = setTimeout(function () {
        mainTaskRegistration(); 
    }, 2000);

    function settingsChanged() {
        mainTaskUnregister();
        setTimeout(function () {
            mainTaskRegistration();
        }, 1000);
    };

    /*registration (Main)*/
    var taskRegistered = false;
    var exampleTaskName = "barometerBackgroundTask";
    var background = Windows.ApplicationModel.Background;
    function mainTaskRegistration() {
        var iter1 = background.BackgroundTaskRegistration.allTasks.first();
        var triggerInterval = jQuery("#interval").val();
        var trigger = new Windows.ApplicationModel.Background.TimeTrigger(triggerInterval, false);
        while (iter1.hasCurrent) {
            var task1 = iter1.current.value;
            if (task1.name === exampleTaskName) {
                taskRegistered = true;
                break;
            }
            iter1.moveNext();
        }
        if (taskRegistered != true) {
            var access = background.BackgroundExecutionManager.requestAccessAsync().done(function (result) {
                var builder = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();              
                builder.name = exampleTaskName;
                builder.taskEntryPoint = "js\\barometerBackgroundTask.js";
                builder.setTrigger(trigger);
                var task = builder.register();
                taskRegistered = true;
            });
        }
    };

    function mainTaskUnregister() {
        var iter2 = background.BackgroundTaskRegistration.allTasks.first();
        while (iter2.hasCurrent) {
            var task = iter2.current.value;
            if (task.name === exampleTaskName) {
                task.unregister(true);
                taskRegistered = false;
                break;
            }
            iter2.moveNext();
        }
    };

    /*registration (Toast)*/

    var taskRegistered2 = false;
    var exampleTaskName2 = "barometerBackgroundToastTask";
    var background2 = Windows.ApplicationModel.Background;
    function notificationsRegistration() {
        var iter3 = background2.BackgroundTaskRegistration.allTasks.first();
        var trigger2 = new Windows.ApplicationModel.Background.ToastNotificationActionTrigger();
        while (iter3.hasCurrent) {
            var task2 = iter3.current.value;
            if (task2.name === exampleTaskName2) {
                taskRegistered2 = true;
                break;
            }
            iter3.moveNext();
        }
        if (taskRegistered2 != true) {
            var access2 = background2.BackgroundExecutionManager.requestAccessAsync().done(function (result) {
                var builder2 = new Windows.ApplicationModel.Background.BackgroundTaskBuilder();
                builder2.name = exampleTaskName2;
                builder2.taskEntryPoint = "js\\barometerBackgroundTask.js";
                builder2.setTrigger(trigger2);
                var task2 = builder2.register();
                taskRegistered2 = true;
            });
        }
    };
    function notificationsUnregister() {
        var iter4 = background.BackgroundTaskRegistration.allTasks.first();
        while (iter4.hasCurrent) {
            var task3 = iter4.current.value;
            if (task3.name === exampleTaskName2) {
                task3.unregister(true);
                taskRegistered2 = false;
                break;
            }
            iter4.moveNext();
        }
    };
    
    //-----------------------------------CLEAR BADGE--------------------------------

    function clearNotifications() {
        var badgeUpdater = Windows.UI.Notifications.BadgeUpdateManager.createBadgeUpdaterForApplication();
        badgeUpdater.clear();
        Windows.UI.Notifications.ToastNotificationManager.history.clear();
    }
    //----------------------------------TOAST ACTIONS----------------------------------
    Windows.UI.WebUI.WebUIApplication.addEventListener("activated", onActivated);
    function onActivated(e) {
        if (e.argument == "viewDetails") {
            jQuery(".lastTab").click();
            jQuery("body").scrollLeft(jQuery("body").width());
        }
        
    };
    //-----------------------------------------------virtual preassure mark---------------------------------
    var dateMark = new Date();
    var hours = (dateMark.getHours() < 10) ? "0" + dateMark.getHours() : dateMark.getHours();
    var minutes = (dateMark.getMinutes() < 10) ? "0" + dateMark.getMinutes() : dateMark.getMinutes();
    var notifLib = Microsoft.Toolkit.Uwp.Notifications;
    function virtualPreassureMark() {
        setTimeout(function () {
            var currentTime = dateMark.getTime();
            if (!(applicationData.values["virtualMarkTime"]) || currentTime - applicationData.values["virtualMarkTime"] >= 12 * 60 * 60 * 1000) {
                applicationData.values["virtualMarkValue"] = Math.round(barometer_value / 1.33322387415);
                applicationData.values["virtualMarkTime"] = currentTime;
                applicationData.values["virtualMarkHoursMinutes"] = "" + hours + ":" + minutes + "";
            }
        }, 3000)
    }
    virtualPreassureMark();
    //------------------------------------------------------tile update--------------------------------------
    Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().clear();
    if (applicationData.values["tileNotifications"]) {
        setTimeout(function () {
            showNotification();
        },3000)
    }
    function showNotification() {

        var string_1 = resourceLoader.getString("current") + Math.round(barometer_value / 1.33322387415) + resourceLoader.getString('mmHg');
        var string_2 = resourceLoader.getString("was") + applicationData.values["virtualMarkValue"] + resourceLoader.getString('mmHg');
        var string_3 = "(" + applicationData.values["virtualMarkHoursMinutes"] + ")";

        //medium
        var tileContent = new notifLib.TileContent();
        var tileVisual = new notifLib.TileVisual();
        var tileBinding = new notifLib.TileBinding();
        var tileBindingContentAdaptive = new notifLib.TileBindingContentAdaptive();

        var adaptiveGroup = new notifLib.AdaptiveGroup();

        var adaptiveSubgroup = new notifLib.AdaptiveSubgroup();

        var adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = string_1;
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.caption;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = string_2;
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        //adaptiveText.hintWrap = true;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = string_3;
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        //adaptiveText.hintWrap = true;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveGroup.children.push(adaptiveSubgroup);

        tileBindingContentAdaptive.children.push(adaptiveGroup);

        tileBinding.content = tileBindingContentAdaptive;

        tileBinding.branding = notifLib.TileBranding.name;
        tileVisual.tileMedium = tileBinding;

        //wide
        tileBinding = new notifLib.TileBinding();
        tileBindingContentAdaptive = new notifLib.TileBindingContentAdaptive();

        adaptiveGroup = new notifLib.AdaptiveGroup();

        adaptiveSubgroup = new notifLib.AdaptiveSubgroup();

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = string_1;
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.caption;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = string_2;
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = string_3;
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveGroup.children.push(adaptiveSubgroup);

        tileBindingContentAdaptive.children.push(adaptiveGroup);

        tileBinding.content = tileBindingContentAdaptive;

        tileBinding.branding = notifLib.TileBranding.name;
        tileVisual.tileWide = tileBinding;

        tileVisual.lockDetailedStatus1 = string_1;
        tileVisual.lockDetailedStatus2 = string_2 + " " + string_3;

        tileContent.visual = tileVisual;


        // Create the tile notification
        var tileNotif = new Windows.UI.Notifications.TileNotification(tileContent.getXml());

        // And send the notification to the primary tile
        Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueueForSquare150x150(true);
        Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueueForWide310x150(true);
        Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotif);
    }
});