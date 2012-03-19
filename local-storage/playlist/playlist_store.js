/** 
 * Saves and loads the playlist from local storage.
 *
 * @author TCLee
 */

/**
 * Adds song to playlist and saves it to local storage.
 *
 * @param item song to add to playlist.
 */
 function save(song) {
     var playlistArray = getSavedSongs();
     playlistArray.push(song);
     localStorage.setItem("playlist", JSON.stringify(playlistArray));
 }
 
 /**
  * Loads the playlist from local storage.
  */
 function loadPlaylist() {
     var ul = document.getElementById("playlist");
     var playlistArray = getSavedSongs();
     var songCount = playlistArray.length;
     
     // Playlist loaded from local storage is added to the HTML document.
     for (var i = 0; i < songCount; i++) {
         var li = document.createElement("li");
         li.innerHTML = playlistArray[i];
         ul.appendChild(li);
     }
 }
 
 /**
  * Returns an array of songs for the playlist from local storage.
  */
 function getSavedSongs() {
     return getStoreArray("playlist");
 }
 
 function getStoreArray(key) {
     var playlistArray = localStorage.getItem(key);
     
     if (playlistArray === null || playlistArray.length === 0) {
         playlistArray = new Array();
     } else {
         playlistArray = JSON.parse(playlistArray);
     }
     return playlistArray;
 }