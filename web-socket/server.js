/**
 * Head First HTML5
 *
 * Web Sockets using node.js and socket.io
 *
 *
 * server.js - Server side code
 *
 * @author TC Lee
 */
 
var util = require('util');

// Create a node-static server to serve files from the current directory.
var fileServer = new(require('node-static').Server)();

// Create the HTTP server. 
// The callback function gets called when a client connects to this server.
var server = require('http').createServer(function(request, response) {
        
    request.addListener('end', function() {                
        // Serve the html, css, js etc... files.
        fileServer.serve(request, response, function(error, result) {            
            if (error) {
                // Error: Could not serve requested file.
                util.log("> Error serving " + request.url + " - " + error.message);
                response.writeHead(error.status, error.headers);                
                response.end();
            } else {
                // Success: File was served successfully.
                util.log("> " + request.url + " - " + result.message);
            }
        });
    });
});

// Use another port number instead of 80 to avoid clashing with existing HTTP server.
server.listen(8080);


// Listen for incoming Web Socket (ws://) requests.
var io = require('socket.io').listen(server);

// Setup the Web Socket requests handler.
io.sockets.on('connection', function(socket) {
    // Send a message to the client.
    socket.emit('message_from_server', 'Server: Hello, Client. How are you feeling?');
    
    // Listen for message from the client and log it to console.
    socket.on('message_from_client', function(data) {
        console.log(data);
    });
});