/**
 * videoBooth.js
 *
 * 
 *
 * @author TC Lee
 */
 
 
// Initialize the video booth when page finishes loading.
window.onload = function () {
    var videoBooth = new VideoBooth();
    videoBooth.init();
};

/**
 * VideoBooth class encapsulates the video booth's data and functionality.
 */
function VideoBooth() {
    // The demo videos used for testing.
    var videos = {
        video1: "video/demovideo1",
        video2: "video/demovideo2"
    };
    
    // Reference to the <video> element.
    var video = null;
    
    // Reference to the video effect function.
    var effectFunction = null;
    
    /**
     * Initializes the VideoBooth instance.
     */
    this.init = function () {
        // Get a reference to the video element that will be used by
        // the methods in this class.
        video = document.getElementById("video");

        // Load the appropriate video format.
        // When user clicks "Play", video will be already loaded.
        video.src = videos.video1 + getFormatExtension();
        video.load();
        
        // Listen for events from the <video> element.
        video.addEventListener("play", processFrame, false);
        video.addEventListener("ended", videoEnded, false);
        
        // Set onclick handlers for video controls.
        initHandlersForSelector("a.control", handleControl);

        // Set onclick handlers for video effects.
        initHandlersForSelector("a.effect", setEffect);

        // Set onclick handlers for video selection.
        initHandlersForSelector("a.videoSelection", setVideo);

        // Visually set the "video1" and "normal" buttons to be in 
        // pressed state.
        pushUnpushButtons("video1", []);
        pushUnpushButtons("normal", []);        
    };
    
    /**
     * Handles the onclick event for the video's controls.
     */
    var handleControl = function(event) {
        // Which video control button was clicked?
        var sourceId = event.target.getAttribute("id");
        
        if (sourceId === "play") {
            // --- User pressed the "Play" button. ---            
            pushUnpushButtons("play", ["pause"]);
            
            // If video has played all the way to the end, then we'll
            // need to load it again before playing.
            // Else if video was paused, we don't need to load it again.
            if (video.ended) {
                video.load();
            }                        
            video.play();
        } else if (sourceId === "pause") {
            // --- User pressed the "Pause" button. ---
            pushUnpushButtons("pause", ["play"]);
            
            video.pause();
        } else if (sourceId === "loop") {
            // --- User toggled the "Loop" button. ---
            if (isButtonPushed("loop")) {
                pushUnpushButtons("", ["loop"]);
            } else {
                pushUnpushButtons("loop", []);
            }
            
            // Toggle the video's loop boolean property.
            video.loop = !video.loop;
        } else if (sourceId === "mute") {
            // --- User toggled the "Mute" button. ---
            if (isButtonPushed("mute")) {
                pushUnpushButtons("", ["mute"]);
            } else {
                pushUnpushButtons("mute", []);
            }
            
            // Toggle the video's muted boolean property.
            video.muted = !video.muted;
        }
    };
    
    /**
     * Handles the onclick event for the video's effects.
     */
    var setEffect = function (event) {
        // Which video effect was selected?
        var sourceId = event.target.getAttribute("id");

        // Select the appropriate effect function to process the video.
    	if (sourceId === "normal") {
    		pushUnpushButtons("normal", ["western", "noir", "scifi"]);    		    
            effectFunction = null;
    	} else if (sourceId === "western") {
    		pushUnpushButtons("western", ["normal", "noir", "scifi"]);
    		effectFunction = western;
    	} else if (sourceId === "noir") {
    		pushUnpushButtons("noir", ["normal", "western", "scifi"]);
    		effectFunction = noir;
    	} else if (sourceId === "scifi") {
    		pushUnpushButtons("scifi", ["normal", "western", "noir"]);    		
    		effectFunction = scifi;
    	}    	
    };

    /**
     * Handles the onclick event for the video selection.
     */    
    var setVideo = function (event) {
        // Which video was selected?
        var sourceId = event.target.getAttribute("id");
        
        // Update the UI buttons state.
    	if (sourceId === "video1") {
    		pushUnpushButtons("video1", ["video2"]);
    	} else if (sourceId === "video2") {
    		pushUnpushButtons("video2", ["video1"]);
    	}
    	
    	// Load and play the selected video.
    	video.src = videos[sourceId] + getFormatExtension();
    	video.load();
    	video.play();
    	
    	// Update the "Play" UI button state to "Pressed" to show 
    	// that video is currently playing.
    	pushUnpushButtons("play", ["pause"]);
    };
    
    /**
     * When the video begins playing, this method will be called to 
     * add an effect (if necessary) to the video.
     */
    var processFrame = function () {
        // If video is not playing, there's nothing to process!
        if (video.paused || video.ended) { return; }
        
        var bufferCanvas = document.getElementById("buffer");
        var displayCanvas = document.getElementById("display");
        
        var buffer = bufferCanvas.getContext("2d");
        var display = displayCanvas.getContext("2d");
        
        // Get one frame of the video as an image and draw it on the buffer.
        buffer.drawImage(video, 0, 0, bufferCanvas.width, 
                         bufferCanvas.height);
        
        // Get the video frame's image data from the buffer.
        var frame = buffer.getImageData(0, 0, bufferCanvas.width, 
                                        bufferCanvas.height);
                                       
        // Length of the frame data is 4X longer because
        // each pixel has 4 values: RGBA.
        var length = frame.data.length / 4;
        
        // Apply the effect on each and every pixel in the video frame.
        for (var i = 0; i < length; i++) {
            // Each pixel takes up 4 positions in the array.
            // R is in position 0, G in position 1, B in position 2
            var r = frame.data[i * 4 + 0];
            var g = frame.data[i * 4 + 1];
            var b = frame.data[i * 4 + 2];
            
            // If user selected "Normal" effect, we will not need to do
            // any processing.
            if (null !== effectFunction) {
                // effectFunction will apply the effect by updating 
                // the frame.data with new pixel values.
                effectFunction(i, r, g, b, frame.data);
            }
        }
        
        // After the video frame has been processed completely in 
        // the buffer, we draw it on the display.
        display.putImageData(frame, 0, 0);
        
        // Run the processFrame method again as soon as possible to
        // apply the effect to any remaining frames.
        setTimeout(processFrame, 0);
    };
    
    /**
     * Film Noir filter. Applies a Black and White effect to the video.
     *
     * @param index the index of the pixel
     * @param r, g, b the red, green and blue pixel values
     * @param data the reference to the frame data array in the canvas
     */
    var noir = function (index, r, g, b, data) {
        // Set a pixel to a grey scale value based on the 
        // pixel's brightness.
        var brightness = (3 * r + 4 * g + b) >>> 3;
        brightness = (brightness < 0 ? 0 : brightness);
        
        data[index * 4 + 0] = brightness; // R
        data[index * 4 + 1] = brightness; // G
        data[index * 4 + 2] = brightness; // B
    };
    
    /**
     * Western filter. Applies a Sepia effect to the video.
     */
    var western = function (index, r, g, b, data) {
        var brightness = (3 * r + 4 * g + b) >>> 3;        
        data[index * 4 + 0] = brightness + 40; // R
        data[index * 4 + 1] = brightness + 20; // G
        data[index * 4 + 2] = brightness - 20; // B
    };
    
    /**
     * Sci-Fi filter. Applies a negative or inverted color effect to video.
     */
    var scifi = function (index, r, g, b, data) {
        data[index * 4 + 0] = Math.round(255 - r); // R
        data[index * 4 + 1] = Math.round(255 - g); // G
        data[index * 4 + 2] = Math.round(255 - b); // B
    };
    
    /**
     * Black and White cartoon filter.
     */
    var bwcartoon = function (index, r, g, b, data) {
        var offset = index * 4;
        
        if (data[offset] < 120) {
            data[offset + 0] = 80; // R
            data[offset + 1] = 80; // G
            data[offset + 2] = 80; // B
        } else {
            data[offset + 0] = 255; // R
            data[offset + 1] = 255; // G
            data[offset + 2] = 255; // B
        }
        
        data[offset + 3] = 255; // A
    };
    
    /**
     * Handles the event when video has ended playing.
     */
    var videoEnded = function () {
        // "Unpush" the Play button when the video has ended.
        pushUnpushButtons("", ["play"]);
    };
            
    /**
     * For each element that match given CSS selector, we set
     * its onclick property to given handler.
     */    
    var initHandlersForSelector = function (selector, handler) {
        var elements = document.querySelectorAll(selector);
        for (var i = 0, elementsLength = elements.length; 
             i < elementsLength; i++) {
            elements[i].onclick = handler;
        }       
    };
    
    /**
     * Updates the buttons states.
     *
     * @param idToPush the id of button to set to "pushed" state
     * @param idArrayToUnpush the ids of one or more buttons to set to 
     *                        "unpushed" state
     */
    var pushUnpushButtons = function (idToPush, idArrayToUnpush) {
        var anchor = null;
        var cssClass = null;
        
        // Make sure we have a button to set to "pushed" state.
        if (idToPush.length !== 0) {
            // Get the anchor element and its CSS class.
            anchor = document.getElementById(idToPush);
            cssClass = anchor.getAttribute("class");
            
            // If button is already in "pushed" state, 
            // no need to "push" again.
            if (cssClass.indexOf("selected") === -1) {
                // Set the button to "pushed" state by appending
                // "selected" class to the anchor element.
                cssClass += " selected";
                anchor.setAttribute("class", cssClass);
                
                // Update the background image of the anchor element
                // to a "button pushed" image to cover up the original image.
                var pushedImage = "url(images/" + idToPush + "pressed.png)";
                anchor.style.backgroundImage = pushedImage;
            }
        }
        
        // To "unpress" buttons, we loop through each anchor ID to "unpress".
        for (var i = 0, idArrayToUnpushLength = idArrayToUnpush.length; 
             i < idArrayToUnpushLength; i++) {
                 
            // Get the anchor element and its CSS class.
            anchor = document.getElementById(idArrayToUnpush[i]);
            cssClass = anchor.getAttribute("class");
            
            // If button is already in "unpushed" state, no need to 
            // "unpush" again.
            if (cssClass.indexOf("selected") >= 0) {
                // Remove "selected" from CSS class attribute.
                cssClass = cssClass.replace("selected", "");
                anchor.setAttribute("class", cssClass);
                
                // Remove background image, so that we see the
                // original "unpushed" button image.
                anchor.style.backgroundImage = "";
            }
        }        
    };
    
    /**
     * Returns true if a button is pushed (active); false otherwise.
     */
    var isButtonPushed = function (id) {
        var anchor = document.getElementById(id);
        var cssClass = anchor.getAttribute("class");
        return (cssClass.indexOf("selected") >= 0);
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
        } else {
            return "";
        }
    };    
}