(function () {

    var notifLib = Microsoft.Toolkit.Uwp.Notifications;

    var tileContent = new notifLib.TileContent();
    var tileVisual = new notifLib.TileVisual();
    var tileBinding = new notifLib.TileBinding();
    var tileBindingContentAdaptive = new notifLib.TileBindingContentAdaptive();

    var adaptiveGroup = new notifLib.AdaptiveGroup();

    var adaptiveSubgroup = new notifLib.AdaptiveSubgroup();

    var adaptiveText = new notifLib.AdaptiveText();

    var date = new Date();
    var hours = date.getHours;
    var minutes = date.getMinutes;

    adaptiveText.text = "Start:" + hours + ":" + minutes;
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

    tileContent.visual = tileVisual;

    // Create the tile notification
    var tileNotif = new Windows.UI.Notifications.TileNotification(tileContent.getXml());

    // And send the notification to the primary tile
    Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotif);
})();