document.onreadystatechange = function() {
    "use strict";
    /* [functions.utils] */
    /**
     * @description [Callback handler for tld list call. Cleans list and produces an array containing the tlds.]
     * @return {Null} [Invokes format_tlds.]
     */
    function get_tlds() {
        if (xhr.readyState == 4) {
            // cache response
            var resp = xhr.responseText;
            // clean text
            resp = resp
                // replace commas with colons
                .replace(/,/g, ":")
                // collapse line breaks
                .replace(/\n\r|\r\n/g, ",").trim();
            format_tlds(resp.split(","));
        }
    }
    /**
     * @description [Formats tlds by pairing it with its allowed slds into an object.]
     * @param  {Array} tlds [The tlds and slds to format.]
     * @return {Null}       [Writes object to dom to easily copy.]
     */
    function format_tlds(tlds) {
        var formated = {};
        for (var i = 0, l = tlds.length; i < l; i++) {
            var current_tld_string = tlds[i]; // format .ca:.nt.ca
            // split into parts
            var tld = (current_tld_string.match(/^\..+\:/) || [""])[0].replace(/^\.|\:/g, ""),
                sld = (current_tld_string.match(/\:.+\./) || [""])[0].replace(/\.|\:/g, "");
            // start adding to object
            if (!formated[tld]) { // this is the first
                formated[tld] = [sld];
            } else { // for recurring tld just add the sld to its array
                formated[tld].push(sld);
                formated[tld].sort();
            }
        }
        // write to dom to easy copy and paste
        document.write(JSON.stringify(formated));
    }
    // all resources have loaded
    if (document.readyState == "complete") {
        // get the suffixes
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", get_tlds);
        // append timestamp to url to bypass cache
        xhr.open("GET", "https://raw.githubusercontent.com/gavingmiller/second-level-domains/master/SLDs.csv?t=" + ((new Date()).getTime()));
        xhr.send(null);
    }
};
