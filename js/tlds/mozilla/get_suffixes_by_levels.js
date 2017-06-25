document.onreadystatechange = function() {
    "use strict";
    /* [functions.utils] */
    /**
     * @description [Handler for suffix list call. Cleans the list to pass to format_suffixes.]
     * @return {Null} [Invokes format_suffixes.]
     */
    function get_suffixes() {
        if (xhr.readyState == 4) { // ===BEGIN PRIVATE DOMAINS===
            // cache response
            var resp = xhr.responseText;
            // the domains to filter: icann, private, null (icann + private)
            var type = "icann";
            // reset the resp test if neede be...
            if (type) {
                // split the response
                var parts = resp.split("===BEGIN PRIVATE DOMAINS===");
                if (type === "icann") {
                    resp = parts[0];
                } else if (type === "private") {
                    resp = parts[1];
                }
            }
            // clean text
            resp = resp
                // remove comments
                .replace(/^\/\/.*/gm, "")
                // collapse line breaks
                .replace(/\n+/g, "\n")
                // trim ends
                .trim();
            // format the suffixes array
            format_suffixes(resp.split("\n"));
            // format_suffixes(resp);
        }
    }
    /**
     * @description [Formats suffixes into an object. The keys are the domain names and the values are an object
     *               containing the suffixes contained in arrays organized in domain levels.]
     * @return {Null}          [Writes object to dom to easily copy.]
     */
    function format_suffixes(suffixes) {
        // define vars
        var database = {
                "localhost": {
                    "0": ["localhost"],
                    "length": 1
                }
            },
            suffix_count = 0;
        // loop over the suffixes
        for (var i = 0, l = suffixes.length; i < l; i++) {
            // cache current suffix
            var suffix = suffixes[i].replace(/^(\!|\*\.)/, "");
            // check whether single tld or multiple levels
            var levels = suffix.split(".");
            var last = levels.pop();
            // add the last to the database object
            if (!database[last]) {
                // increment the suffix_count
                suffix_count++;
                // add it to the database
                database[last] = {
                    "0": [last],
                    "length": 1
                };
            }
            // check the length of the levels
            var level_count = levels.length;
            if (level_count) {
                // add it to the database
                if (!database[last][level_count]) {
                    // add the new level if it does not exist
                    database[last][level_count] = [levels.join(".")];
                    // set the length
                    database[last]["length"] = Math.max.apply(null, [database[last]["length"], level_count + 1]);
                } else {
                    // if the level_count exists just push the levels
                    // into the array
                    database[last][level_count].push(levels.join("."));
                }
            }
        }
        // set the suffix_count
        database["length"] = suffix_count;
        // print the suffixes object to the document
        document.write(JSON.stringify(database));
    }
    // all resources have loaded
    if (document.readyState == "complete") {
        // get the suffixes
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", get_suffixes);
        // append timestamp to url to bypass cache
        xhr.open("GET", "js/tlds/mozilla/list.txt?t=" + ((new Date()).getTime()));
        xhr.send(null);
    }
};
