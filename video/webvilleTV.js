/**
 * webvilleTV.js
 *
 * Webville TV plays/loops a list of videos in its playlist.
 *
 * @author TC Lee
 */


// When page finishes loading, WebvilleTV will play the videos.
window.onload = new WebvilleTV().start;

/**
 * WebvilleTV class.
 */
function WebvilleTV() {
    // Keeps track of the video we're currently playing in the playlist.
    var position = 0;
        
    // List of videos to play.
    // File format of the videos to use will be determined programmatically.
    var playlist = ["video/preroll", 
                    "video/areyoupopular", 
                    "video/destinationearth"];
                    
    // Suitable video format for use with the browser.
    var format = null;

    // Reference to the <video> element.
    // We can only grab the <video> element AFTER the page 
    // has loaded!
    var video = null;
    
    /**
     * Initialize and start playing the videos in the playlist.
     */
    this.start = function () {
        video = document.getElementById("video");        
        play();
    };
    
    /**
     * Start playing the videos.
     */
     var play = function () {
        // Get the most suitable video format for the browser.
        format = getFormatExtension();
        
        // When a video has ended, we want to be notified.
        video.addEventListener("ended", nextVideo, false);

        // If an error occurs with the video, we will handle it accordingly.
        video.addEventListener("error", videoError, false);
    
        // Get the video source URL from the playlist.
        video.src = playlist[position] + format;
        
        // Load the video and play it.
        video.load();
        video.play();
        
        // DEBUG
        console.log("Playing " + video.currentSrc);
    };
    
    /**
     * When a video has ended, this function will be called to play the
     * next video.
     */
     var nextVideo = function () {
        // Move to next video in playlist.
        // If reached end of playlist we'll just loop back to start again.
        position++;
        position = (position >= playlist.length ? 0 : position);
        
        // Load and play the next video.
        video.src = playlist[position] + format;
        video.load();
        video.play();
        
        // DEBUG
        console.log("Playing " + video.currentSrc);
    };
    
    /**
     * If video encountered an error, this method will handle it.
     */
    var videoError = function () {
        if (video.error) {
            video.poster = "images/technicaldifficulties.jpg";
            alert(video.error.code);
        }
    };
    
    /**
     * Returns the best video format to use for the browser.
     */
    var getFormatExtension = function () {
        if (video.canPlayType("video/mp4").length !== 0) {
            return ".mp4";
        } else if (video.canPlayType("video/webm").length !== 0) {
            return ".webm";
        } else if (video.canPlayType("video/ogg").length !== 0) {
            return ".ogv";
        }
    };
}