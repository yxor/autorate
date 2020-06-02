
/**
 * This is the main callback, checks if you're on a video page then rates the video depending on multiple settings.
 */
const rateCallback = async() => {
  if(!window.location.href.includes("youtube.com/watch"))
    return;
  
  const state = await browser.storage.local.get();
  if(!state.enabled)
    return;

  const channel = state.channels.find((channel) => {
    return channel.channelID == getChannelID();
  })
  
  let rating = (channel && channel.ratingAction !== "default") ? channel.ratingAction : state.defaultAction;
  
  if(rating === "notRate") return;


  // get a list with like and dislike button. (like is first and dislike is second)
  const [likeButton, dislikeButton] = await waitFor("#top-level-buttons > ytd-toggle-button-renderer", 600);
  if(is_rated(likeButton, dislikeButton))
    return;
  
  // Wait until the percentage of the video is reached.
  await waitUntil(() => {
    const video = document.querySelector("video");
    if(!video) return false;
    if(is_rated(likeButton, dislikeButton)) return false;

    const watched = getPlayedTime(video);
    const rateAfter = state.rateAfter;

    return watched.percent >= rateAfter;

  }, 500);


  // rate the video
  switch(rating){
    case "like":
      likeButton.click();
      break;
    case "dislike":
      dislikeButton.click();
      break;
  }

}


// Exectue the callback everytime a setting is changed.
browser.storage.onChanged.addListener( async(changes, _) => {
  await rateCallback();
})

const target = document.querySelector('title');

const config = { attributes: true, childList: true, subtree: true };

// Execute the callback when the title changes.
const observer = new MutationObserver(async (mutations, observer) => {
  await rateCallback();
});

// Execute the callback when window first loads.
window.onload = async () => {
  await rateCallback();
};

// Start observing the title changes.
observer.observe(target, config);
