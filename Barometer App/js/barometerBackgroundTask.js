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

        console.log("Action from toast:" + taskActionDetail);
        
        var key = null,
            applicationData = Windows.Storage.ApplicationData.current.localSettings;
        //
        // TODO: Write your JavaScript code here to do work in the background.
        // If you write a loop or callback, remember  have it check for canceled==false.
        //

        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        //-----------------------------------NOTIFICATION---------------------------------------------------
        var notifLib = Microsoft.Toolkit.Uwp.Notifications;

        var tileContent = new notifLib.TileContent();
        var tileVisual = new notifLib.TileVisual();
        var tileBinding = new notifLib.TileBinding();
        var tileBindingContentAdaptive = new notifLib.TileBindingContentAdaptive();

        var adaptiveGroup = new notifLib.AdaptiveGroup();

        var adaptiveSubgroup = new notifLib.AdaptiveSubgroup();

        var adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Jennifer Parker";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.caption;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Photos from our trip";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Check out these awesome photos I took while in New Zealand!";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveGroup.children.push(adaptiveSubgroup);

        tileBindingContentAdaptive.children.push(adaptiveGroup);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "";
        tileBindingContentAdaptive.children.push(adaptiveText);

        adaptiveGroup = new notifLib.AdaptiveGroup();

        adaptiveSubgroup = new notifLib.AdaptiveSubgroup();

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Steve Bosniak";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.caption;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Build 2015 Dinner";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Want to go out for dinner after Build tonight?";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveGroup.children.push(adaptiveSubgroup);

        tileBindingContentAdaptive.children.push(adaptiveGroup);

        tileBinding.content = tileBindingContentAdaptive;

        tileBinding.branding = notifLib.TileBranding.name;
        tileVisual.tileMedium = tileBinding;

        tileBinding = new notifLib.TileBinding();
        tileBindingContentAdaptive = new notifLib.TileBindingContentAdaptive();

        adaptiveGroup = new notifLib.AdaptiveGroup();

        adaptiveSubgroup = new notifLib.AdaptiveSubgroup();

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Jennifer Parker";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.subtitle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Photos from our trip";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Check out these awesome photos I took while in New Zealand!";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveGroup.children.push(adaptiveSubgroup);

        tileBindingContentAdaptive.children.push(adaptiveGroup);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "";
        tileBindingContentAdaptive.children.push(adaptiveText);

        adaptiveGroup = new notifLib.AdaptiveGroup();

        adaptiveSubgroup = new notifLib.AdaptiveSubgroup();

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Steve Bosniak";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.subtitle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Build 2015 Dinner";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveText = new notifLib.AdaptiveText();
        adaptiveText.text = "Want to go out for dinner after Build tonight?";
        adaptiveText.hintStyle = notifLib.AdaptiveTextStyle.captionSubtle;
        adaptiveSubgroup.children.push(adaptiveText);

        adaptiveGroup.children.push(adaptiveSubgroup);

        tileBindingContentAdaptive.children.push(adaptiveGroup);

        tileBinding.content = tileBindingContentAdaptive;


        tileBinding.branding = notifLib.TileBranding.name;
        tileVisual.tileWide = tileBinding;

        tileVisual.lockDetailedStatus1 = "Line1";
        tileVisual.lockDetailedStatus2 = "Line2";
        tileVisual.lockDetailedStatus3 = "Line3";

        tileContent.visual = tileVisual;


        // Create the tile notification
        var tileNotif = new Windows.UI.Notifications.TileNotification(tileContent.getXml());

        // And send the notification to the primary tile
        Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotif);
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
        adaptiveText1.text = "New info";
        toastBindingGeneric.children.push(adaptiveText1);

        adaptiveText1 = new notifLib1.AdaptiveText();
        adaptiveText1.text = "Toast message:" + hours + ":" + minutes + "-" + taskActionDetail;
        toastBindingGeneric.children.push(adaptiveText1);

        toastVisual.bindingGeneric = toastBindingGeneric;

        toastContent.visual = toastVisual;

        var toastActionsCustom = new notifLib.ToastActionsCustom();

        var toastButton = new notifLib.ToastButton("Clear", "action=clear&callId=1000");
        toastButton.activationType = notifLib.ToastActivationType.background;
        toastButton.imageUri = "Content/images/icons-png/check-white.png";
        toastActionsCustom.buttons.push(toastButton);


        toastContent.actions = toastActionsCustom;


        toastContent.launch = "action=viewDetails&callId=1000";



        // Create the toast notification
        var toastNotif = new Windows.UI.Notifications.ToastNotification(toastContent.getXml());

        // And send the notification
        Windows.UI.Notifications.ToastNotificationManager.createToastNotifier().show(toastNotif);
        //-------------------------------------------------------------------------------------------------

        // Record information in LocalSettings to communicate with the app.
        //
        key = backgroundTaskInstance.task.taskId.toString();
        applicationData.values[key] = "Succeeded";

        //
        // A JavaScript background task must call close when it is done.
        //
        close();
    }

    /*

    if (!canceled) {
        doWork();
    } else {
        //
        // Record information in LocalSettings to communicate with the app.
        //
        key = backgroundTaskInstance.task.taskId.toString();
        settings.values[key] = "Canceled";

        //
        // A JavaScript background task must call close when it is done.
        //
        close();
    }
    */
    doWork();
})();