// utility functions


/**
 * Waits for the element queried by the selector to appear.
 *
 * @param {string} selector - Selector for the element to wait for.
 * @param {number} interval - Interval of time between each check.
 * @return {Promise} List of elements found.
 */
const waitFor = (selector, interval) => {
    return new Promise((res, rej) => {
        waitForElementToDisplay(selector, interval);
        function waitForElementToDisplay(selector, time) {
            if (document.querySelectorAll(selector) != null) {
                res(document.querySelectorAll(selector));
            }
            else {
                setTimeout(function () {
                    waitForElementToDisplay(selector, time);
                }, time);
            }
        }
    });
}


/**
 *  Get the time actually watched by the user.
 * 
 * @param {HTMLVideoElement} video
 * @returns {{total: number, percent: number}}
 */
const getPlayedTime = (video) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/TimeRanges
    let totalPlayed = 0;
    let played = video.played; // get an array of TimeRanges 

    for (let i = 0; i < played.length; i++) {
        totalPlayed += played.end(i) - played.start(i);
    }

    return {
        total: totalPlayed,
        percent: totalPlayed / video.duration * 100
    };
}


/**
 * Wait until a predicat is satisfied.
 *
 * @param {CallableFunction} predicat - function that returns truthful values.
 * @param {number} interval - Interval of time between each check in millieseconds.
 * @return {Promise<boolean>}
 */
const waitUntil = (predicat, interval) => {
    return new Promise((res, rej) => {
        waitForPredicate(predicat, interval);
        function waitForPredicate(predicat, time) {
            const flag = predicat();
            if (flag) {
                res(flag);
            }
            else {
                setTimeout(function () {
                    waitForPredicate(predicat, time);
                }, time);
            }
        }
    });
}

/**
 * Get the ID of the current youtube channel.
 *
 * @return {string} The ID of the youtube channel.
 */
const getChannelID = () => {
    const channelNode = document.querySelector("ytd-channel-name.ytd-video-owner-renderer > div:nth-child(1) > div:nth-child(1) > yt-formatted-string:nth-child(1) > a:nth-child(1)");
    return channelNode.getAttribute("href").split("/")[2];
}

/**
 * Check if the current video is rated.
 *
 * @return {boolean}
 */
const is_rated = (likeButton, dislikeButton) => {
    return likeButton.classList.contains("style-default-active" ) || dislikeButton.classList.contains("style-default-active" );
}
  