/**
 * mandel.js
 *
 * @author TC Lee
 */

//------------------------------------------------------------------
// GLOBAL VARIABLES
//------------------------------------------------------------------
 
/** 
 * Constant that represents the number of Web Workers available. 
 * You can tweak this value to see if it improves performance.
 */
var NUMBER_OF_WORKERS = 8;

/** Array of our Web Workers to perform the tasks. */
var workers = [];

/** Keeps track of which row we're on as we work row by row 
    through the image. */
var nextRow = 0;

/** Keeps track of the age of the fractal generation. The newer 
    the fractal generation the larger the number. */
var generation = 0;


//------------------------------------------------------------------
// FUNCTIONS
//------------------------------------------------------------------

// Wait until the page finishes loading to start our web app.
window.onload = init;

/**
 * Initialize our web app.
 */
function init() {
    // Initialize the graphics properties. Defined in "mandelLib.js".
    setupGraphics();
    
    // User can click on the canvas to zoom in on a specific fractal.
    canvas.onclick = function (event) {
        handleClick(event.clientX, event.clientY);
    };
    
    // When browser window is resized, we will also resize the canvas.
    window.onresize = function () {
        resizeToWindow();
    };
    
    for (var i = 0; i < NUMBER_OF_WORKERS; i++) {
        var worker = new Worker("worker.js");
        
        // When worker has completed its work, we'll process the
        // worker's results.        
        worker.onmessage = function (event) {
            processWork(event.target, event.data);
        }
        
        // When workers are created they have nothing to do yet, so
        // they're idle.
        worker.idle = true;
        
        // Add worker to array that keeps track of all workers.
        workers.push(worker);
    }
    
    // Start the workers to let them begin working!
    startWorkers();
}

/**
 * Start the workers by giving out tasks to them.
 */
function startWorkers() {
    // Each time the user zooms in, we'll have to restart drawing again.
    // So, we reset nextRow and increment generation.
    generation++;
    nextRow = 0;
    
    // Give out tasks to all the workers.
    for (var i = 0; i < NUMBER_OF_WORKERS; i++) {
        var worker = workers[i];
        
        // Only give the task out to workers that are not busy.
        if (worker.idle) {
            // Creates a task object with all the data that
            // a worker needs to compute that row.
            // Defined in "mandelLib.js".
            var task = createTask(nextRow);
            
            // Worker is now busy, since we've given him some
            // work to do.
            worker.idle = false;
            
            // Send the task data to the worker, so that he
            // can start work.
            worker.postMessage(task);
            
            // Increment the row, so next available worker gets 
            // the next row.
            nextRow++;
        }
    }
}

/**
 * This function will be called to handle the event when a worker 
 * finishes its assigned task.
 *
 * @param worker the worker who has finished its task
 * @param workerResults the results returned from worker
 */
function processWork(worker, workerResults) {
    // Make sure the worker's result generation match the current
    // generation. If it does not match, then it's a previous generation
    // and we should ignore it. This is to prevent drawing an old row
    // from the previous image on the canvas.
    if (workerResults.generation === generation) {
        // Hand the results to drawRow to draw the 
        // pixels to the canvas.
        drawRow(workerResults);    
    }
            
    // Since this worker is now free, we'll give it another task to do.
    reassignWorker(worker);
}

/**
 * Reassign given worker to next task (if available).
 *
 * @param worker the worker to assign a task to
 */
function reassignWorker(worker) {
    // This worker will work on nextRow.
    // The next worker will work on nextRow + 1.
    var row = nextRow++;
    
    if (row >= canvas.height) {
        // If we've drawn the last row already, then we're done.
        worker.idle = true;
    } else {
        // Else we've still got rows to draw, assign task to worker.
        var task = createTask(row);
        worker.idle = false;
        worker.postMessage(task);
    }
}

/**
 * Called when user clicks on the canvas to zoom into the fractal.
 *
 * @param x the x coordinate of the click
 * @param y the y coordinate of the click
 */
function handleClick(x, y) {
    // Resizes the area of the fractal with the x, y position
    // at the center of the new area. It also makes sure the
    // new area has the same aspect ratio of the existing one.
    var width = r_max - r_min;
    var height = i_min - i_max;
    var click_r = r_min + ((width * x) / canvas.width);
    var click_i = i_max + ((height * y) / canvas.height);
    
    var zoom = 8;
    
    // Zoom level determines how far zoomed in we are into the
    // fractal, which determines which values of the Mandelbrot Set
    // are being computed.
    r_min = click_r - (width / zoom);
    r_max = click_r + (width / zoom);
    i_max = click_i - (height / zoom);
    i_min = click_i + (height / zoom);
    
    // Restart the workers to redraw the fractal.
    startWorkers();
}

/**
 * Resize the canvas to the size of the browser window.
 */
function resizeToWindow() {
    // Make sure the canvas's width and height matches the new
    // width and height of the window.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Update the values that the workers will use to do their
    // computation based on the new width and height. This is
    // to ensure the fractal will always fit the canvas and maintain
    // the aspect ratio of the window.
    var width = ((i_max - i_min) * canvas.width / canvas.height);
    var r_mid = (r_max + r_min) / 2;
    r_min = r_mid - (width / 2);
    r_max = r_mid + (width / 2);
    
    // Recreate the ImageData object, so that it's the same width 
    // as the new canvas's width.
    rowData = ctx.createImageData(canvas.width, 1);
    
    // Start the workers to begin drawing on the resized canvas.
    startWorkers();
}
