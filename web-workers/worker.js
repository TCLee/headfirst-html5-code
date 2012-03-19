/**
 * worker.js
 *
 * The Web Worker that computes a row using Mandelbrot Set's formula.
 *
 * @author TC Lee
 */
 
 // Need to import "workerLib.js" for the computeRow function.
importScripts("workerLib.js");

onmessage = function (task) {
    // Get the data from the task object and pass it to
    // computeRow function, which does all the complex computation.
    var workerResult = computeRow(task.data);
    
    // Result is then passed back to the main script.
    postMessage(workerResult);
};