(
/**
 * Gets the id and the name of the youtube channel currently opened. Only works in video pages.a
 * 
 * @returns {{channelID : string, channelName : string}} Returns the channel name and ID.
 */
() => {
    const channelNode = document.querySelector("ytd-channel-name.ytd-video-owner-renderer > div:nth-child(1) > div:nth-child(1) > yt-formatted-string:nth-child(1) > a:nth-child(1)");
    const channelID = channelNode.getAttribute("href").split("/")[2];
    const channelName = channelNode.innerHTML;

    return {
        channelID,
        channelName
    }

})();