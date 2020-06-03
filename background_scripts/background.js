

/**
 * Can be used to set the state of the addon on/off.
 * 
 * @param {boolean} newState State of the addon, true for On and false for Off.
 */
const setEnabled = (newState) => {

    // toggle the state of the extension
    browser.storage.local.set({"enabled": newState});

    // toggle the icon and title
    const newTitle = (newState) ? "AutoRate:ON" : "AutoRate:OFF";

    browser.browserAction.setTitle({title: newTitle});

    // set the badge
    const badgeText = (newState) ? "on" : "off";

    browser.browserAction.setBadgeBackgroundColor({color: "#555"});
    browser.browserAction.setBadgeTextColor({color: "#fef"});
    browser.browserAction.setBadgeText({text: badgeText});

}

const setupStorage = () => {
    // rate at the beginning by default
    browser.storage.local.get(async (state) => {
        if(!state.likeAt)
            await browser.storage.local.set({rateAfter: 0});

        if(!state.defaultAction)
            await browser.storage.local.set({defaultAction: "notRate"});

        if(!state.channels)
            await browser.storage.local.set({channels: []});
    });
}
// extension enabled by default
setupStorage();
setEnabled(true);
