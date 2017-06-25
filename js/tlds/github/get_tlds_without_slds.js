document.onreadystatechange = function() {
    "use strict";
    /* [functions.utils] */
    /**
     * @description [Callback handler for tld list call. Cleans list and produces an array containing the tlds.]
     * @return {Null} [Writes object to dom to easily copy.]
     */
    function get_tlds() {
        if (xhr.readyState == 4) {
            // cache response
            var resp = xhr.responseText;
            // clean text
            resp = resp
                // collapse line breaks
                .replace(/\n|\r/g, "").trim()
                // remove the starting dot
                .replace(/^\./, "");
            // turn to array + write to dom to easy copy
            document.write(JSON.stringify(resp.split(".")));
        }
    }
    // all resources have loaded
    if (document.readyState == "complete") {
        // get the suffixes
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", get_tlds);
        // append timestamp to url to bypass cache
        xhr.open("GET", "https://raw.githubusercontent.com/gavingmiller/second-level-domains/master/TLDs%20without%20SLDs.csv?t=" + ((new Date()).getTime()));
        xhr.send(null);
    }
};
