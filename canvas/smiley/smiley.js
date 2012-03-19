/**
 * smiley.js
 *
 * Draws a smiley face on the canvas.
 *
 * @author TC Lee
 */

window.onload = drawSmileyFace;

/**
 * Draws a smiley face on the canvas.
 */
function drawSmileyFace() {
    var canvas = document.getElementById("smiley");
    var context = canvas.getContext("2d");
    
    // Set the thickness of the lines in the drawing.
    context.lineWidth = 3;
    
    // Draw the smiley's face circle.
    context.beginPath();
    context.arc(300, 300, 200, 0, degreesToRadians(360), true);
    context.fillStyle = "#ffff00";
    context.fill();
    context.stroke();
    
    // Draw the smiley's left eye.
    context.beginPath();
    context.arc(200, 250, 25, 0, degreesToRadians(360), true);
    context.fillStyle = "black";
    context.fill();
    
    // Draw the smiley's right eye.
    context.beginPath();
    context.arc(400, 250, 25, 0, degreesToRadians(360), true);
    context.fillStyle = "black";
    context.fill();
    
    // Draw the smiley's nose.
    context.beginPath();
    context.moveTo(300, 300);
    context.lineTo(300, 350);
    context.stroke();
    
    // Draw the smiley's mouth. A little bit more tricky ;-)
    context.beginPath();
    context.arc(300, 350, 75, degreesToRadians(20), 
                degreesToRadians(160), false);
    context.stroke();
}

/**
 * Returns a number value in radians given a number in degrees.
 *
 * @return a number value in radians
 */
function degreesToRadians(degrees) {
    return ( (degrees * Math.PI) / 180 );
}
