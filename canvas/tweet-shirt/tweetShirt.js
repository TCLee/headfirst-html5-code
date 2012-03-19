/**
 * tweetShirt.js
 *
 * Shows a preview of a user customized T-Shirt.
 *
 * @author TC Lee
 */

// Constants for the maximum number of squares or circles to draw 
// on the canvas.
var MAX_SQUARES = 20;
var MAX_CIRCLES = 20;

// How many characters are allowed per line.
var LINE_LIMIT = 60;

window.onload = function () {
    // Handle Preview button being clicked.
    var button = document.getElementById("previewButton");
    button.onclick = previewTShirt;
};

/**
 * Draw the T-Shirt preview on the canvas.
 */
function previewTShirt() {
    // We need the canvas and its 2D context for us to draw on.
    var canvas = document.getElementById("tshirtCanvas");
    var context = canvas.getContext("2d");
    
    // Fill the canvas with selected background color to clear the canvas 
    // for each preview.
    fillBackgroundColor(canvas, context);
            
    // Draw the selected shape on the canvas.
    var shape = getSelectedValueFrom("shape");    
    if (shape === "squares") {
        for (var square = 0; square < MAX_SQUARES; square++) {
            drawSquare(canvas, context);
        }
    } else if (shape === "circles") {
        for (var circle = 0; circle < MAX_CIRCLES; circle++) {
            drawCircle(canvas, context);
        }
    }
    
    // Draw the tweet's text on the canvas.
    drawText(canvas, context);
    
    // Draw the Twitter bird image on the canvas.
    drawBird(canvas, context);
}

/**
 * Fill the entire canvas with selected background color.
 */
function fillBackgroundColor(canvas, context) {
    var bgColor = getSelectedValueFrom("backgroundColor");
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw a random sized square at a random position within the 
 * canvas boundaries.
 */
function drawSquare(canvas, context) {
    // Calculate a random x, y position and random width for the square.
    var width = Math.floor(Math.random() * 40);
    var x = Math.floor( Math.random() * canvas.width );
    var y = Math.floor( Math.random() * canvas.height );        
                
    // Draw a square at position. Use light blue as fill color.
    context.fillStyle = "lightblue";
    context.fillRect(x, y, width, width);
}

/**
 * Draw a random sized circle at a random position within the 
 * canvas boundaries.
 */
function drawCircle(canvas, context) {        
    // Calculate a random x, y position and random width for the circle.
    var radius = Math.floor(Math.random() * 40);
    var x = Math.floor( Math.random() * canvas.width );
    var y = Math.floor( Math.random() * canvas.height );
    
    context.beginPath();
    
    // Draw a circle path.
    // Start Angle = 0
    // End Angle = 360
    // Direction = Clockwise (false)
    context.arc(x, y, radius, 0, degreesToRadians(360), false);
    
    // Fill the circle with light blue color.
    context.fillStyle = "lightblue";
    context.fill();
}

/**
 * Draws the tweet on the canvas.
 */
function drawText(canvas, context) {
    var fgColor = getSelectedValueFrom("foregroundColor");
    
    // Draw the top left text: "I saw this tweet"
    context.fillStyle = fgColor;
    context.font = "bold 1em sans-serif";
    context.textAlign = "left";
    context.fillText("I saw this tweet", 20, 40);
    
    // Draw the selected tweet's text.
    // TODO: Test only! Remove later!
    var tweet = "This is a very long tweet. This is a very VERY long tweet. This is an even LONGER tweet. This is a SUPER long tweet.  This is a TWEETY-tweet.";
    //var tweet = getSelectedValueFrom("tweets");
    context.font = "italic 1.2em serif";
    
    // If tweet is too long, we'll have to break it down to 
    // multiple lines.
    if (tweet.length > LINE_LIMIT) {
        var tweetLines = splitIntoLines(tweet);
        for (var i = 0, numberOfLines = tweetLines.length; 
            i < numberOfLines; i++) {
            context.fillText(tweetLines[i], 30, 70 + (i * 25));
        }
    } else {
        context.fillText(tweet, 30, 100);
    }
        
    // Draw the bottom right text: "and all I got was this lousy t-shirt!"
    context.font = "bold 1em sans-serif";
    context.textAlign = "right";
    context.fillText("and all I got was this lousy t-shirt!", 
                     canvas.width - 20, canvas.height - 40);                         
}

/**
 * Draws the Twitter bird image on the canvas.
 */
function drawBird(canvas, context) {
    var birdImage = new Image();
    birdImage.src = "twitterBird.png";
    birdImage.onload = function () {
        context.drawImage(birdImage, 20, 120, 70, 70);
    };
}

/**
 * A simple test function to draw a triangle.
 */
function drawTriangle(context) {
    // Path for a triangle.
    context.beginPath();
    context.moveTo(100, 150);
    context.lineTo(250, 75);
    context.lineTo(125, 30);
    context.closePath();

    // Draw the triangle with a line width of 5 pixels.
    context.lineWidth = 5;
    context.stroke();
    
    // Fill the triangle with red color.
    context.fillStyle = "red";
    context.fill();
}

/**
 * Returns a number value in radians given a number in degrees.
 *
 * @return a number value in radians
 */
function degreesToRadians(degrees) {
    // 360 degrees = 2 * Math.PI radians
    // 1 degree = (1 * Math.PI) / 180 radians
    // ...
    // x degree = (x * Math.PI) / 180 radians
    return ( (degrees * Math.PI) / 180 );
}

/**
 * JSONP callback function that handles the array of tweets returned from
 * Twitter web service.
 */
function updateTweets(tweets) {
    var tweetsSelection = document.getElementById("tweets");
    
    for (var i = 0, tweetsCount = tweets.length; i < tweetsCount; i++) {
        var tweet = tweets[i];
        
        var option = document.createElement("option");
        option.text = tweet.text;
        
        // Replace double quotes (") with single quote (') to avoid
        // formatting issues with HTML.
        option.value = tweet.text.replace("\"", "'");
        
        // Add the tweet as a selectable option.
        tweetsSelection.options.add(option);
    }
    tweetsSelection.selectedIndex = 0;
}

/**
 * Split a string into multiple lines.
 *
 * @param string the string to split into multiple lines
 * @return an array of strings
 */
// function splitIntoLines(string) {
//     var lines = new Array();
//     
//     // Loop 1
//     var startOfLineIndex = 0;
//     var endOfLineIndex = LINE_LIMIT;    
//     var lineBreakIndex = string.indexOf(' ', endOfLineIndex);    
//     lines.push(string.substring(startOfLineIndex, lineBreakIndex));
//     
//     // Loop 2
//     startOfLineIndex = lineBreakIndex + 1;
//     endOfLineIndex = startOfLineIndex + LINE_LIMIT;
//     lineBreakIndex = string.indexOf(' ', endOfLineIndex);
//     lines.push(string.substring(startOfLineIndex, lineBreakIndex));
// 
//     // Loop 3 (with check to see if reach end of string)
//     startOfLineIndex = lineBreakIndex + 1;
//     endOfLineIndex = startOfLineIndex + LINE_LIMIT;
//     lineBreakIndex = string.indexOf(' ', endOfLineIndex);
//     if (lineBreakIndex === -1) {
//         // No more space char to insert line break into.
//         break;
//     }
//     lines.push(string.substring(startOfLineIndex, lineBreakIndex));
//     
//     // Loop ends when:
//     // 1. Reach end of string.
//     // 2. No more space chars to insert line breaks into.
//     while (endOfLineIndex < string.length && lineBreakIndex !== -1) {
//         
//     }
//                             
//     return lines;
// }


/**
 * Split a string into multiple lines.
 *
 * This is a very simplistic algorithm that splits a string into
 * multiple lines by inserting line breaks into space characters.
 *
 * @param string the string to split into multiple lines
 * @return an array of strings
 */
function splitIntoLines(string) {
    var stringLength = string.length;
    
    // Split lines will be stored into an Array.
    var lines = new Array();
    
    // 1. startOfLineIndex keeps track of the start of a line.
    // 2. endOfLineIndex keeps track of the end of a line.
    // 3. lineBreakIndex keeps track of where to insert the line break.
    var startOfLineIndex = 0;
    var endOfLineIndex = LINE_LIMIT;
    var lineBreakIndex = 0;
        
    // Keep splitting the string into multiple lines as long as
    // we have not reach end of the string yet.
    while (startOfLineIndex < stringLength) {
        // Find for a space character to insert our line break into.
        lineBreakIndex = string.indexOf(' ', endOfLineIndex);
        
        // If no space characters found, we have no place to insert a
        // line break. So, we just use the remaining string as one line.
        if (lineBreakIndex === -1) { 
            lines.push(string.substring(startOfLineIndex));
            break;
        }
        
        // Add current line to array.
        lines.push(string.substring(startOfLineIndex, lineBreakIndex));
                                        
        // Update index for the next line.
        startOfLineIndex = lineBreakIndex + 1;
        endOfLineIndex = startOfLineIndex + LINE_LIMIT;        
    }
            
    // Return the split lines.
    return lines;
}

/**
 * Returns the selected item's value in a <select> element.
 *
 * @param elementId the id of the <select> element
 * @return the selected item's value in a <select> element
 */
function getSelectedValueFrom(elementId) {
    var selectObj = document.getElementById(elementId);
    var selectedIndex = selectObj.selectedIndex;
    return selectObj[selectedIndex].value;
}