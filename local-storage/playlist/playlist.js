// Wait until page finishes loading to begin running this Javascript.
window.onload = init;

/**
 * Initialize the button handler when page finishes loading.
 */
function init() {
    var button = document.getElementById("addButton");
    button.onclick = handleButtonClick;
    
    // Loads previously saved songs from local storage.
    loadPlaylist();
}

/**
 * Handler for when the user presses the "Add Song" button.
 */
function handleButtonClick() {
    var textField = document.getElementById("songTextField");
    var songName = textField.value;
 
    // Check to make sure user has entered in a song name 
    // (i.e. song name cannot be left blank).
    if (songName.length === 0) {
        alert("Please enter in a song name first.");
    } else {
        // Add the song to the playlist.
        
        var li = document.createElement("li");
        li.innerHTML = songName;
        
        var ul = document.getElementById("playlist");
        ul.appendChild(li);
        
        // Save the new song to local storage, so that it can be loaded later again.
        save(songName);
    }        
}