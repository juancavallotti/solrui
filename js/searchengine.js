$(document).ready(function(){
    
    $("#searchForm").submit(function() {
        console.log("Submitted form!!");
        performSearch()
        
        //do not *really* submit the form.
        return false;
    });
    
    
});

/**
 * Get the search text.
 * @returns {undefined}
 */
function getSearchText() {
    return $("#searchField").val();
}

/**
 * Query solr for results
 * @param {type} text
 * @returns {Array}
 */
function findResults(text, callback) {
    console.log("Trying to find results with text: " + text);
    
    var url = getSolrBaseUrl("select");
    
    //perform a json query
    $.ajax({
       dataType: "jsonp",
       url: url,
       data: {
           q: text,
           hl: true,
           "hl.fl": "content title",
       },
       success: callback,
       error: function() {
          alert("Error calling solr:"); 
       }
    });
    
}

/**
 * Display the results in a pretty fashion.
 * @param {type} results
 * @returns {undefined}
 */
function displayResults(results) {
    console.log("Will display some results!");
    
    //console.log(JSON.stringify(results.highlighting));
    
    var content = "";
    
    $(results.response.docs).each(function() {
        
        var text = "";
        
        console.log("Result of highlighting: " + JSON.stringify( results.highlighting[this.id] ));
        
        if (typeof(results.highlighting[this.id].content) !== 'undefined') {
            text = results.highlighting[this.id].content[0];
        }
        
        content += "<div>"
                + "<h4><a href='"+this.url+"' target='_blank'>"+this.title+"</a></h4>" 
                + "<p class='resultUrl'><em>"+this.url+"</em></p>" 
                + "<p class='resultHl'>"+text+"</p>" 
                + "</div>";
    });
    
    
    $("#content").html(content);
}

/**
 * Perform a search on solr.
 * @returns {undefined}
 */
function performSearch() {
    //get the search text
    var text = getSearchText();
    
    //query solr for results with the display function as callback
    findResults(text, displayResults);
}


function getSolrBaseUrl(operation) {
    //todo get this from settings.
    return "http://localhost:8080/solr/collection1/" + operation + "/?wt=json&json.wrf=?";
}
