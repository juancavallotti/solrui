$(document).ready(function() {

    $("#searchForm").submit(function() {
        console.log("Submitted form!!");
        performSearch()

        //do not *really* submit the form.
        return false;
    });

    
    //configure the search modal
    $("#settingsModal").on('show', presentData);
    $("#updateSettingsBtn").click(updateSettings);
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

    var url = getSolrBaseUrl();

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

        console.log("Result of highlighting: " + JSON.stringify(results.highlighting[this.id]));

        if (typeof(results.highlighting[this.id].content) !== 'undefined') {
            text = results.highlighting[this.id].content[0];
        }

        content += "<div>"
                + "<h4><a href='" + this.url + "' target='_blank'>" + this.title + "</a></h4>"
                + "<p class='resultUrl'><em>" + this.url + "</em></p>"
                + "<p class='resultHl'>" + text + "</p>"
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


function getSolrBaseUrl() {
    
    var settings = retrieveSettings();
    
    //todo get this from settings.
    return settings.serverUrl + settings.searchHandler + "/?wt=json&json.wrf=?";
}

function updateSettings() {
    
    var settings = new Object();
    settings.serverUrl = $("#solrServerField").val();
    settings.searchHandler = $("#solrSearchHandlerField").val();
    
    storeSettings(settings);
    $("#settingsModal").modal('hide');
}

function presentData() {
    
    var settings = retrieveSettings();
    
    $("#solrServerField").val(settings.serverUrl);
    $("#solrSearchHandlerField").val(settings.searchHandler);
    
}


/******* Auxiliary functions to retrieve and save data *******/

function retrieveSettings() {
    var ret = new Object();
    ret.serverUrl = findSetting('serverUrl', "http://localhost:8080/solr/collection1/");
    ret.searchHandler = findSetting('searchHandler', 'select');

    return ret;
}

function storeSettings(settings) {
    storeSetting(settings, 'serverUrl');
    storeSetting(settings, 'searchHandler');
}


/**
 * Find a setting on the local storage or fallback to the default value.
 * @param {type} name
 * @param {type} defValue
 * @returns {undefined}
 */
function findSetting(name, defValue) {
    if (typeof(localStorage[name]) === 'undefined') {
        return defValue;
    } else {
        return localStorage[name];
    }
} 

/**
 * Store a setting with the given key in the local storage.
 * @param {type} settings
 * @param {type} key
 * @returns {undefined}
 */
function storeSetting(settings, key) {
    if (typeof(settings[key] !== 'undefined') ){
        localStorage[key] = settings[key];
    }
}
