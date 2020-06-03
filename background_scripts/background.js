
// Addon icons.
const iconsOn = {
    256: "../assets/on256.png",
    128: "../assets/on128.png"
  }
  
  const iconsOff = {
    256: "../assets/off256.png",
    128: "../assets/off128.png"
  }


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
    const iconToUse = (newState) ? iconsOn : iconsOff;

    browser.browserAction.setTitle({title: newTitle});
    browser.browserAction.setIcon({path: iconToUse});
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
