/**
 * myLocation.js  
 *
 * Track the user's position on the map.
 *
 * @author TC Lee
 */
 
// The watch ID will be given to us when we start watching/tracking 
// the user's location.
var watchId = null;

// Stores the Google Maps API's map object.
var map = null;
 
// WickedlySmart HQ coordinates.
var ourCoords = {
   latitude: 47.624851,
   longitude: -122.52099 
};

// Coordinates representing the user's most recent location.
var previousCoords = null;

// Determines how far should each marker be distanced from each other.
var MARKER_DISTANCE_IN_METERS = 20;


// Call the function getMyLocation as soon as the browser finished loading 
// the page.
window.onload = getMyLocation;

/**
 * Gets the user's current location.
 */
function getMyLocation() {    
    // Check to see if browser supports the Geolocation API.
    if (navigator.geolocation) {
        // Retrieves the user's current location.
        navigator.geolocation.getCurrentPosition(
            displayLocation, 
            displayError, 
            {enableHighAccuracy: true, timeout: 9000});
        
        // Watch button when clicked will track the user's movements.
        var watchButton = document.getElementById("watch");
        watchButton.onclick = watchLocation;
        
        // Clear Watch button when clicked will stop the tracking.
        var clearWatchButton = document.getElementById("clearWatch");
        clearWatchButton.onclick = clearWatch;
    } else {
        alert("Oops, no geolocation support. :-(");
    }
}

/**
 * Handler for when user clicks on the Watch button to start tracking the user's 
 * movements.
 */
function watchLocation() {
   watchId = navigator.geolocation.watchPosition(
                displayLocation, 
                displayError,
                {enableHighAccuracy: true, timeout: 3000}); 
}

/**
 * Handler for when user clicks on the Clear Watch button to stop tracking
 * the user's movements.
 */
function clearWatch() {
    if (null !== watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

/**
 * Handler that is going to be called when the browser successfully
 * retrieved the user's current location.
 *
 * @param position the current position of the user
 */
function displayLocation(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    
    // Display the user's current coordinates.
    var locationDiv = document.getElementById("location");
    locationDiv.innerHTML = "You are at Latitude: " + latitude + ", Longitude: " + longitude + 
                            " (with " + position.coords.accuracy + " meters accuracy)";                            
    
    // Display the distance of user from WickedlySmart HQ.
    var distance = computeDistance(position.coords, ourCoords);
    var distanceDiv = document.getElementById("distance");
    distanceDiv.innerHTML = "You are " + distance + " km from the WickedlySmart HQ.";
    
    // The first time "dislayLocation" is called we call "showMap" to 
    // create the map and display a marker for user's initial location.
    // Subsequent calls will call "scrollMapToPosition" to add a new 
    // marker and re-center the map to user's new location.
    if (null === map) {
        showMap(position.coords);
        previousCoords = position.coords;
    } else {
        // Make sure user has moved at least some distance before we add another
        // marker. Otherwise, the map will be filled with too many markers!
        var meters = computeDistance(position.coords, previousCoords) * 1000;
        if (meters > MARKER_DISTANCE_IN_METERS) {
            scrollMapToPosition(position.coords);
            previousCoords = position.coords;
        }                
    }
}

/**
 * Handler that will be called if browser failed to get the location.
 *
 * @param error the error object that contains information on why location 
 *              retrieval failed
 */
function displayError(error) {
    // Declare constants for readability.
    var ERROR_UNKNOWN = 0;
    var ERROR_PERMISSION_DENIED = 1;
    var ERROR_POSITION_UNAVAILABLE = 2;
    var ERROR_REQUEST_TIMEOUT = 3;
    
    // Associate each error code with an error message to make it more meaningful to the user.
    var errorTypes = {
        0: "Unknown error",
        1: "Permission denied by user", 
        2: "Position is not available",
        3: "Request timed out"
    };
    
    // Get the user friendly error message string given the error code.
    var errorMessage = errorTypes[error.code];
    
    // For specific error codes, there's sometimes additional info in the 
    // error object. So, we append the additional info to our error message.
    if (error.code === ERROR_UNKNOWN || 
        error.code === ERROR_POSITION_UNAVAILABLE) {
                        
        errorMessage += " " + error.message;
    }
    
    // Display the error message to the user.
    var div = document.getElementById("location");
    div.innerHTML = errorMessage;
}

/**
 * Show the user's current location on the map.
 *
 * @param coords the coordinates representing the user's current location
 */
function showMap(coords) {
    // Convert the Geolocation's API coordinates to Google Map's API coordinates.
    var googleLatAndLong = new google.maps.LatLng(coords.latitude, 
                                                  coords.longitude);
    // Options argument for Google Maps API.
    var mapOptions = {
        zoom: 10,
        center: googleLatAndLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);
    
    // Add marker to map to represent user's current location.
    var title = "Your Location";
    var content = "You are here: " + coords.latitude + ", " + coords.longitude;
    addMarker(map, googleLatAndLong, title, content);
}

/**
 * Keep the map centered on user's location as she moves around.
 * 
 * @param coords the coordinates representing the user's most 
 *               recent location
 */
function scrollMapToPosition(coords) {
    // Create a google.maps.LatLng object from Geolocation's coordinates.
    var latitude = coords.latitude;
    var longitude = coords.longitude;
    var latlong = new google.maps.LatLng(latitude, longitude);
    
    // Scroll the map to specified latitude and longitude.
    map.panTo(latlong);
    
    // Add marker on map to mark user's new location.
    addMarker(map, latlong, "Your new location", 
        "You moved to: " + latitude + ", " + longitude);
}

/**
 * Add a marker to the map to represent the user's current location.
 * 
 * @param map a google.maps.Map object
 * @param latlong a google.maps.LatLng object representing the coordinates
 * @param title the title string for the marker
 * @param content the content string for the info window that pops up
 */
function addMarker(map, latlong, title, content) {
    // Google Maps' Marker object's options.
    var markerOptions = {
        position: latlong,
        map: map,
        title: title,
        clickable: true // Set to true to show info window when marker is clicked.
    }; 
    
    var marker = new google.maps.Marker(markerOptions);
    
    // Google Map's InfoWindow object's options.
    var infoWindowOptions = {
        content: content,
        position: latlong,
    };
    
    var infoWindow = new google.maps.InfoWindow(infoWindowOptions);
    
    // When the marker is clicked, the info window will pop open.
    google.maps.event.addListener(marker, "click", 
        function() {
            infoWindow.open(map);
        }
    );
}

/**
 * Calculates the distance between two points on a sphere using the 
 * Haversine equation.
 *
 * @param startCoords first coordinate on the sphere
 * @param destCoords second coordinate on the sphere
 * @returns the distance between two points on a sphere
 */
function computeDistance(startCoords, destCoords) {
    // Radius of the Earth in km.
    var RADIUS = 6371;
    
    // Convert the latitude and longitude degrees to radians.
    var startLatRads = degreesToRadians(startCoords.latitude);
    var startLongRads = degreesToRadians(startCoords.longitude);
    var destLatRads = degreesToRadians(destCoords.latitude);
    var destLongRads = degreesToRadians(destCoords.longitude);

    // Calculate the distance using Haversine equation.
	var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) + 
				   Math.cos(startLatRads) * Math.cos(destLatRads) * 
				   Math.cos(startLongRads - destLongRads)) * RADIUS;
 
    return distance;
}

/**
 * Converts a value in degree to radians.
 *
 * @return a value in radians
 */
function degreesToRadians(degrees) {
    var radians = (degrees * Math.PI) / 180;
    return radians;
}