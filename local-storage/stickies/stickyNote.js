/**
 * stickyNote.js 
 *
 * A HTML5 web app that allows a user to add/remove sticky notes.
 * Uses HTML5 local storage feature to save and load the sticky notes.
 *
 * @author TC Lee
 */
 
 
/** Constant representing the sticky notes array's key in local storage. */
var STICKY_NOTE_ARRAY_KEY = "stickyNoteKeysArray";

// Run this script only when page finishes loading.
window.onload = init;


/**
 * StickyNote class represents a sticky note object in local storage.
 *
 * @param text the text of the sticky note object
 * @param color the color of the sticky note object
 */
function StickyNote(text, color) {
    this.text = text;
    this.color = color;
}

/**
 * Initialize the Sticky Notes web app.
 */
function init() {
    // When "Add" button is clicked, a new sticky note is created.
    var button = document.getElementById("add_button");
    button.onclick = addButton_onClick;
    
    // Load and show the created sticky notes.
    loadAndShowStickyNotes();
}

/**
 * User clicks on Add button to add a new sticky note.
 */
function addButton_onClick(e) {
    createStickyNote();
}

/**
 * User clicks on a sticky note to remove it.
 */
function stickyNote_onClick(e) {
    // If user clicked on the <span> element instead, we need to get the
    // id of its parent element which is <li>.
    // Otherwise, if user clicked on the <li> element, we can just use its id.
    var key = (e.target.tagName.toLowerCase() === "span" ? 
               e.target.parentNode.id : 
               e.target.id);

    // Remove sticky note with given key.
    removeStickyNote(key);
}

/**
 * Load all existing sticky notes from local storage and show
 * them on the page.
 */
function loadAndShowStickyNotes() {
    var stickyNoteKeys = getStickyNoteKeysArray();
    
    // Loop through each sticky note and show it on the page. 
    for (var i = 0, keyCount = stickyNoteKeys.length; 
         i < keyCount; i++) {
        
        var key = stickyNoteKeys[i];
        var value = JSON.parse(localStorage[key]);
        
        // Show sticky note on the page.
        addStickyNoteToDOM(key, value);
    }
}

/**
 * Create new sticky note and add it to local storage.
 * Also, shows the newly created sticky note on the page.
 */
function createStickyNote() {
    // Create a unique key for the sticky note using UUID.
    var key = "sticky_" + uuid();
    
    // Get the sticky note's value from text field input element.
    var value = document.getElementById("note_text").value;
    
    // Get the selected sticky note color.
    var colorSelect = document.getElementById("note_color");
    var color = colorSelect[colorSelect.selectedIndex].value;
    
    // Save the new sticky note object to local storage.
    var stickyNoteObject = new StickyNote(value, color);
    localStorage[key] = JSON.stringify(stickyNoteObject);    

    // Update sticky note keys array in local storage.
    var stickyNoteKeysArray = getStickyNoteKeysArray();
    stickyNoteKeysArray.push(key);
    localStorage[STICKY_NOTE_ARRAY_KEY] = JSON.stringify(stickyNoteKeysArray);
        
    // Show the newly created sticky note object on the page.    
    addStickyNoteToDOM(key, stickyNoteObject);
}

/**
 * Removes sticky note with given key from local storage and page.
 *
 * @param key the key of the sticky note to remove
 */
function removeStickyNote(key) {
    // Remove sticky note from local storage.
    localStorage.removeItem(key);
    
    // --- Remove given key from sticky notes array stored in local storage. ---
    
    // Load the sticky note keys array from local storage.
    var stickyNoteKeysArray = getStickyNoteKeysArray();
    
    // Remove given key from sticky note keys array.
    for (var i = 0, arrayLength = stickyNoteKeysArray.length; 
         i < arrayLength; i++) {
        if (key === stickyNoteKeysArray[i]) {
            stickyNoteKeysArray.splice(i, 1);
        }
    }
    
    // Save sticky note keys array back to local storage.
    localStorage[STICKY_NOTE_ARRAY_KEY] = JSON.stringify(stickyNoteKeysArray);
    
    // Remove sticky note from page too.
    removeStickyNoteFromDOM(key);
}

/**
 * Adds a new sticky note to the page's DOM to show the sticky 
 * note on the page.
 *
 * @param id the unique ID for the sticky note element
 * @param stickyNoteObject the StickyNote object to add to page
 */
function addStickyNoteToDOM(id, stickyNoteObject) {
    // Get the <ul> element that contains all the sticky notes.
    var stickies = document.getElementById("stickies");   
    
    // Create the <li> element to represent the sticky note.
    var sticky = document.createElement("li");    
    sticky.setAttribute("id", id);
    sticky.style.backgroundColor = stickyNoteObject.color;
 
    // Set the style and text content of the sticky note element.
    var span = document.createElement("span");   
    span.setAttribute("class", "sticky");
    span.innerHTML = stickyNoteObject.text;

    // Add the sticky note to the <ul> element.
    sticky.appendChild(span);
    stickies.appendChild(sticky);
    
    // Remove sticky note when user clicks on it.
    sticky.onclick = stickyNote_onClick;
}

/**
 * Removes sticky note with given ID from the page's DOM.
 *
 * @param id the unique ID of the sticky note element
 */
function removeStickyNoteFromDOM(id) {
    var stickyNote = document.getElementById(id);    
    stickyNote.parentNode.removeChild(stickyNote);
}

/**
 * Returns an array of sticky note keys from local storage.
 */
function getStickyNoteKeysArray() {
    // Get the sticky note keys array from local storage.
    var stickyNoteKeysArray = localStorage[STICKY_NOTE_ARRAY_KEY];
    
    if (undefined === stickyNoteKeysArray) {
        // If sticky note keys array was not found in local storage,
        // we'll create a new array and save it to local storage.         
        stickyNoteKeysArray = [];
        localStorage[STICKY_NOTE_ARRAY_KEY] = JSON.stringify(stickyNoteKeysArray);
    } else {
        // Else we'll have to parse the JSON string to get the array.
        stickyNoteKeysArray = JSON.parse(stickyNoteKeysArray);
    }        
    return stickyNoteKeysArray;
}

/**
 * Helper function to generate a UUID using random numbers.
 * Example of a UUID: AFF147E4-5BB1-448E-B55D-0A834ADE3124
 *
 * @see http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
 */
function uuid() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}