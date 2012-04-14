/**
 * Head First HTML5
 *
 * Web Sockets using node.js and socket.io
 *
 *
 * client.js - Client side code
 *
 * @author TC Lee
 */

// Connect to the HTTP server.
var socket = io.connect('http://localhost:8080');

// Listen for incoming message from the server.
socket.on('message_from_server', function(data) {
    // Output message received from the server to the text area.    
    writeMessage(data);
    
    // Send a message back to the server.  
    socket.emit('message_from_client', "Client: Hello, Server. I'm feeling great!");
});

function writeMessage(message) {
    var textArea = document.getElementById("messageTextArea");
    textArea.innerHTML = message;
}