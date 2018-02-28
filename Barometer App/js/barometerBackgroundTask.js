//
// A JavaScript background task is specified in a .js file. The name of the file is used to
// launch the background task.
//
(function (e) {
    "use strict";
    //
    // This var is used to get information about the current instance of the background task.
    //
    var backgroundTaskInstance = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current;
    var taskAction = Windows.UI.WebUI.WebUIBackgroundTaskInstance.current.triggerDetails;
    var taskActionDetail;
    if (taskAction !== null) {
        taskActionDetail = taskAction.argument;
    }

    // Query BackgroundWorkCost
    // Guidance: If BackgroundWorkCost is high, then perform only the minimum amount
    // of work in the background task and return immediately.
    //
    var cost = Windows.ApplicationModel.Background.BackgroundWorkCost.currentBackgroundWorkCost;
    Windows.Storage.ApplicationData.current.localSettings.values["BackgroundWorkCost"] = cost.toString();

    var cancel = false;

    //
    // Associate a cancellation handler with the background task.
    //
    function onCanceled(cancelSender, cancelReason) {
        cancel = true;
    }
    backgroundTaskInstance.addEventListener("canceled", onCanceled);


    //
    // This function will do the work of your background task.
    //
    function doWork() {

        //
        // TODO: Write your JavaScript code here to do work in the background.
        // If you write a loop or callback, remember  have it check for canceled==false.
        //
        
        var key = null,
            applicationData = Windows.Storage.ApplicationData.current.localSettings;
        var resourceLoader = new Windows.ApplicationModel.Resources.ResourceLoader();

        if (taskActionDetail == "clear") {
            applicationData.values.remove("virtualMarkTime");
        }

        var date = new Date();
        var hours = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours();
        var minutes = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes();
        //-----------------------------------NOTIFICATION---------------------------------------------------
        var notifLib = Microsoft.Toolkit.Uwp.Notifications;

        //-------------------------------------barometer value---------------------------------------
        var desiredReportIntervalMs;
        var barometer;
        var barometer_value; 

        barometer = Windows.Devices.Sensors.Barometer.getDefault();
        if (barometer) {
            // Select a report interval that is both suitable for the purposes of the app and supported by the sensor.
            // This value will be used later to activate the sensor.
            var minReportIntervalMs = barometer.minReportIntervalMs;
            desiredReportIntervalMs = minReportIntervalMs > 1000 ? minReportIntervalMs : 1000;
            barometer.reportInterval = 50;
            barometer.addEventListener("readingchanged", onBarometerDataChanged);
        }

        function onBarometerDataChanged(e) {
            var reading = e.reading;
            barometer_value = Math.round(e.reading.stationPressureInHectopascals.toFixed(2) / 1.33322387415);
        };
        //---------------------------------------------------------------------------------------------

        //-----------------------------------------------virtual preassure mark---------------------------------
        function virtualPreassureMark() {
            setTimeout(function () {
                var currentTime = date.getTime();
                if (!(applicationData.values["virtualMarkTime"]) || currentTime - applicationData.values["virtualMarkTime"] >= 12 * 60 * 60 * 1000) {
                    applicationData.values["virtualMarkValue"] = barometer_value;
                    applicationData.values["virtualMarkTime"] = currentTime;
                    applicationData.values["virtualMarkHoursMinutes"] = hours + ":" + minutes;
                }
            }, 50)
        }
        virtualPreassureMark();
        //-------------------------------------------weather values------------------------------------------------------------

        var tempForecast;
        var downfallForecast;
        var month = date.getMonth() + 1;
        var tile1;
        var tile2;
        var settingsDifference = 10;

        var initValues = setTimeout(function () {

            var delta = barometer_value - applicationData.values["virtualMarkValue"];
            var difference = delta;
            if (delta < 0) {
                delta += delta * 2;
            }

            if (difference > 0) {

                if (month >= 4 && month < 10) {
                    tempForecast = resourceLoader.getString("tempUp");
                }
                else {
                    tempForecast = resourceLoader.getString("tempDown");
                };

                if (barometer_value > 760) {
                    downfallForecast = resourceLoader.getString("noDownfall");
                }
                else {
                    downfallForecast = resourceLoader.getString("maybeDownfall");
                };
            }
            else {
                if (month >= 4 && month < 10) {
                    tempForecast = resourceLoader.getString("tempDown");
                }
                else {
                    tempForecast = resourceLoader.getString("tempUp");
                };

                if (barometer_value > 760) {
                    downfallForecast = resourceLoader.getString("maybeDownfall");
                }
                else {
                    downfallForecast = resourceLoader.getString("downfall");
                };
                applicationData.values["tempForecast"] = tempForecast;
                applicationData.values["downfallForecast"] = downfallForecast;
            }
            //------------------------------------------TILE UPDATE-------------------------------------------------
           
            if (applicationData.values["tileNotifications"]) {
                Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().clear();
                tile1 = {
                    string_1: resourceLoader.getString("current") + barometer_value + resourceLoader.getString('mmHg'),
                    string_2: resourceLoader.getString("was") + applicationData.values["virtualMarkValue"] + resourceLoader.getString('mmHg'),
                    string_3: "(" + applicationData.values["virtualMarkHoursMinutes"] + ")"
                };
                tile2 = {
                    string_1: resourceLoader.getString('weatherForecast'),
                    string_2: tempForecast,
                    string_3: downfallForecast
                };

                for (var i = 1; i <= 2; i++) {
                    var tile = (i < 2) ? tile2 : tile1;
                    showNotification(tile.string_1, tile.string_2, tile.string_3);
                };
            };
        }, 100);

        function showNotification(string_1, string_2, string_3) {

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
            adaptiveText.hintWrap = true;
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

            tileVisual.lockDetailedStatus1 = tile1.string_1 + " " + tile1.string_2 + " " + tile1.string_3;
            tileVisual.lockDetailedStatus2 = tile2.string_2;
            tileVisual.lockDetailedStatus3 = tile2.string_3;

            tileContent.visual = tileVisual;


            // Create the tile notification
            var tileNotif = new Windows.UI.Notifications.TileNotification(tileContent.getXml());

            //expiration time
            var checkInterval = (applicationData.values["interval"]) ? applicationData.values["interval"] : 15;
            var expiryTime = new Date(date.getTime() + (checkInterval * 60 * 1000));

            tileNotif.expirationTime = expiryTime;

            // And send the notification to the primary tile
            Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueueForSquare150x150(true);
            Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().enableNotificationQueueForWide310x150(true);
            Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotif);
        }
        //-------------------------------------------ALERT----------------------------------------------------
        if (applicationData.values["showNotifications"]) {

            if (applicationData.values["dirrerence"] && applicationData.values["dirrerence"] != 10) {
                settingsDifference = applicationData.values["dirrerence"];
            }
            if (delta >= settingsDifference) {
                setTimeout(function () {
                    //-------------------------------------------BADGE----------------------------------------------------

                    var badgeContent = new notifLib.BadgeNumericContent();
                    var num = 1;
                    badgeContent.number = num;
                    var badgeXml = badgeContent.getXml();

                    // Create the badge notification
                    var badge = new Windows.UI.Notifications.BadgeNotification(badgeXml);
                    // Create the badge updater for the application.
                    var badgeUpdater = Windows.UI.Notifications.BadgeUpdateManager.createBadgeUpdaterForApplication();
                    // And update the badge
                    badgeUpdater.update(badge);

                    //-------------------------------------------TOAST---------------------------------------------------------
                    var notifLib1 = Microsoft.Toolkit.Uwp.Notifications;
                    var toastContent = new notifLib1.ToastContent();
                    var toastVisual = new notifLib1.ToastVisual();
                    var toastBindingGeneric = new notifLib1.ToastBindingGeneric();

                    var adaptiveText1 = new notifLib1.AdaptiveText();
                    adaptiveText1.text = resourceLoader.getString("weatherChange");
                    toastBindingGeneric.children.push(adaptiveText1);

                    adaptiveText1 = new notifLib1.AdaptiveText();
                    adaptiveText1.text = tempForecast;
                    toastBindingGeneric.children.push(adaptiveText1);

                    adaptiveText1 = new notifLib1.AdaptiveText();
                    adaptiveText1.text = downfallForecast;
                    toastBindingGeneric.children.push(adaptiveText1);

                    toastVisual.bindingGeneric = toastBindingGeneric;

                    toastContent.visual = toastVisual;

                    var toastActionsCustom = new notifLib1.ToastActionsCustom();

                    var toastButton = new notifLib1.ToastButton(resourceLoader.getString("clear"), "clear");
                    toastButton.activationType = notifLib1.ToastActivationType.background;
                    toastButton.imageUri = "images/cancel.png";
                    toastActionsCustom.buttons.push(toastButton);

                    toastContent.actions = toastActionsCustom;

                    toastContent.launch = "viewDetails";

                    // Create the toast notification
                    var toastNotif = new Windows.UI.Notifications.ToastNotification(toastContent.getXml());

                    // And send the notification
                    Windows.UI.Notifications.ToastNotificationManager.createToastNotifier().show(toastNotif);
                    //-------------------------------------------------------------------------------------------------

                    // Record information in LocalSettings to communicate with the app.
                    //
                    key = backgroundTaskInstance.task.taskId.toString();
                    applicationData.values[key] = "Succeeded";
                },150)
            }
        }
        //
        // A JavaScript background task must call close when it is done.
        //
        setTimeout(function () {
            close();
        },200);
        
    }

    doWork();
})();