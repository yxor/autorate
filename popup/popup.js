// grab html elements used
const slider = document.getElementById("video-slider");
const sliderDisplay = document.getElementById("percentage-display");
const channelSpecificRating = document.getElementById("channel-specific-rating");
const powerButton = document.getElementById("power-button");
const defaultAction = document.getElementById("select-global");
const channelAction = document.getElementById("select-creator");

const powerButtonIcon = {
  on: "../assets/popup/on.png",
  off: "../assets/popup/off.png"
}

const ratingActions = {
  default: "default",
  like: "like",
  dislike: "dislike",
  notRate: "notRate"
}


// can be used to turn the addon on and off
const setEnabled = (newState) => {
  // toggle the state of the extension
  browser.storage.local.set({enabled: newState});

  // toggle the icon and title 
  const newTitle = (newState) ? "AutoRate:ON" : "AutoRate:OFF";
  powerButton.src = (newState) ? powerButtonIcon.on : powerButtonIcon.off;

  browser.browserAction.setTitle({title: newTitle});

  // set the badge
  const badgeText = (newState) ? "on" : "off";

  browser.browserAction.setBadgeBackgroundColor({color: "#555"});
  browser.browserAction.setBadgeTextColor({color: "#fef"});
  browser.browserAction.setBadgeText({text: badgeText});
  
}

// Turn the extension on and off, change the icon and title when doing that.
powerButton.onclick = () => {
  // get the old extension state and toggle it
  browser.storage.local.get("enabled", (state) => {
      setEnabled(!state.enabled);
      
  });
}


const getRatingString = (rating) => {
  if(rating == 0)
    return `Rate the video when it starts.`;
  
  if(rating == 100)
    return `Rate the video after watching it fully.`;
  
  return `Rate the video after watching <bold>${rating}%</bold> of it.`;
}


/**
 * When the slider is released, its value is saved in the storage.
 */
slider.onchange = () => {
  sliderDisplay.innerHTML = getRatingString(slider.value);
  browser.storage.local.set({rateAfter: slider.value});
}

/**
 * When the slider is moved, its value is only changed visually.
 */
slider.oninput = () => {
  sliderDisplay.innerHTML = getRatingString(slider.value);
}

/**
 * When the default action is changed, its value is saved to the storage. 
 */
defaultAction.onchange = () => {
  const choice = defaultAction.value;
  browser.storage.local.set({defaultAction: choice});

}

/**
 * When the channel specific action is changed, its value is added to 
 * the array of channels in storage.
 */
channelAction.onchange = async() => {
  const choice = channelAction.value;
  const state = await browser.storage.local.get("channels");

  const currentChannel = (await browser.tabs.executeScript({
    file: "./getchannelid.js"
  }))[0];
  
  const toAdd = {...currentChannel, ratingAction: choice};

  // check if the channel is already stored and remove it
  const channelIndex = state.channels.findIndex(channel => {
    return channel.channelID === currentChannel.channelID
  });

  //if the item is found
  if(channelIndex !== -1){
    state.channels.splice(channelIndex, 1); 
  }
  state.channels.push(toAdd);
  
  browser.storage.local.set({channels: state.channels});
}

/**
 * This is the main entry and executed when the popup is opened.
 * it loads values from storage and setup the state of the popup.
 */
const mainEntry = async () => {
  // hide the channel specific select if you're not watching a video
  const url = (await browser.tabs.query({currentWindow: true, active: true}))[0].url;
  const is_watching_video = url.includes("youtube.com/watch");
  
  
  // load the state of the addon
  const state = await browser.storage.local.get();
  powerButton.src = (state.enabled) ? powerButtonIcon.on : powerButtonIcon.off;

  slider.value = state.rateAfter;


  const currentChannel = (is_watching_video) ? (await browser.tabs.executeScript({
    file: "./getchannelid.js"
  }))[0] : null;

  
  if(!currentChannel)
    channelSpecificRating.remove();


  const foundChannel = (currentChannel) ? state.channels.find((channel) => {
    return channel.channelID === currentChannel.channelID;
  }) : null;

  if(currentChannel)
    document.getElementById("creator").innerHTML = currentChannel.channelName;

  sliderDisplay.innerHTML = getRatingString(slider.value);
  defaultAction.value = state.defaultAction;
  channelAction.value = (foundChannel) ? foundChannel.ratingAction : ratingActions.default;
  
  // after everything is ready, clear the content blocker
  document.getElementById("content-blocker").remove();
}

mainEntry();
