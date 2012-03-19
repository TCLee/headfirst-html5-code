/**
 * mightyGumball.js
 *
 * @author TC Lee
 */
 
// Records the latest sales report date and time in milliseconds.
var lastReportTime = 0;

/**
 * Function is called when the page finishes loading.
 */
window.onload = function () {
    // Refresh the sales data every 3 seconds (3000 milliseconds).
    setInterval(handleRefresh, 3000);
};

/**
 * Refresh the sales data when timer interval is up.
 */
function handleRefresh() {
    // URL of the web service.
    // 
    // @param callback the callback method that will receive the sales array data
    // @param lastreporttime return only sales reports since given time 
    //                       in milliseconds
    // @param random a random number to prevent browser from caching the URL
    var url = "http://gumball.wickedlysmart.com?" + 
              "callback=updateSales" + 
              "&lastreporttime=" + lastReportTime +
              "&random=" + new Date().getTime();
    
    // Create a new <script> element that points to the URL of the web service.
    var newScriptElement = document.createElement("script");
    newScriptElement.setAttribute("src", url);
    newScriptElement.setAttribute("id", "jsonp");
    
    var oldScriptElement = document.getElementById("jsonp");
    var head = document.getElementsByTagName("head")[0];
    
    // If the old <script> element does not exists, then we just add
    // the new <script> element.
    // Otherwise, we replace the old <script> element with the new one.
    if (null === oldScriptElement) {
        head.appendChild(newScriptElement);
    } else {
        head.replaceChild(newScriptElement, oldScriptElement);
    }
}

/**
 * When the web service responds with the sales data, we will update the 
 * page accordingly.
 *
 * @param sales an array of Sale objects returned from the web service
 */
function updateSales(sales) {    
    var salesCount = sales.length;
    var salesDiv = document.getElementById("sales");
    
    // Display and format each sale items using HTML and CSS.
    for (var i = 0; i < salesCount; i++) {
        var sale = sales[i];
        var div = document.createElement("div");
        div.setAttribute("class", "saleItem");
        div.innerHTML = sale.name + " sold " + sale.sales + " gumballs";
        salesDiv.appendChild(div);
    }
    
    // Update the most recent sales report date and time.
    if (salesCount > 0) {
        var lastIndex = salesCount - 1;
        lastReportTime = sales[lastIndex].time;
    }
}