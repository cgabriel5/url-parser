document.onreadystatechange = function() {
    "use strict";
    /* [functions.utils] */
    /**
     * @description [Callback handler for alexa top domains. Cleans list and produces an object containing the top 10,000
     *               domains.]
     */
    function get_tlds() {
        if (xhr.readyState == 4) {
            // cache response
            var resp = xhr.responseText;
            // clean text
            resp = resp
                //remove ranking + trim
                .replace(/\d+,/g, "").trim()
                // collapse line breaks
                .replace(/\n/g, ",");
            // make an array
            var top_domains = resp.split(",");
            // we only want the top 10,000
            var database = {};
            for (var i = 0, l = 10000; i < l; i++) {
                // cache the current domain name
                var domain = top_domains[i]; // "google.co.uk"
                // split into parts
                var parts = domain.split(".");
                var site_name = parts.shift(); // i.e "google"
                var suffix = parts.join("."); // i.e "co.uk"
                // add the site_name to the database
                if (!database[site_name]) database[site_name] = [suffix];
                // else just add to the suffix to the array
                else database[site_name].push(suffix);
            }
            document.write(JSON.stringify(database));
        }
    }
    // all resources have loaded
    if (document.readyState == "complete") {
        // get the suffixes
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", get_tlds);
        // [source](http://s3.amazonaws.com/alexa-static/top-1m.csv.zip)
        // download the zip file and place into directory
        // github top DNS domains [https://github.com/opendns/public-domain-lists/blob/master/opendns-top-domains.txt]
        // append timestamp to url to bypass cache
        xhr.open("GET", "http://localhost/projects/url-parser/parser/js/tlds/alexa/top_1m_domains.csv?t=" + ((new Date()).getTime()));
        xhr.send(null);
    }
};
