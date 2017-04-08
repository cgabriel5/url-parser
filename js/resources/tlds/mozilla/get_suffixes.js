document.onreadystatechange = function() {
    "use strict";
    /* [functions.utils] */
    /**
     * @description [Handler for suffix list call. Cleans the list to pass to format_suffixes.]
     * @return {Null} [Invokes format_suffixes.]
     */
    function get_suffixes() {
        if (xhr.readyState == 4) {
            // cache response
            var resp = xhr.responseText;
            // clean text
            resp = resp
                // remove comments
                .replace(/\/\/.+\n?/g, "\n")
                // collapse line breaks
                .replace(/\n\n+/g, "\n")
                // trim ends
                .trim();
            // format the suffixes array
            format_suffixes(resp.split("\n"));
        }
    }
    /**
     * @description [Formats suffixes into an object. Keys are the first char of the suffix and its
     *               value is an array of all the suffixes sorted alphabetically and from shortest to longest.]
     * @return {Null}          [Writes object to dom to easily copy.]
     */
    function format_suffixes(suffixes) {
        var formated = {};
        for (var i = 0, l = suffixes.length; i < l; i++) {
            // get the first char
            if (!formated[suffixes[i][0]]) {
                // this is the first one
                formated[suffixes[i][0]] = [suffixes[i]];
            } else {
                var letter = formated[suffixes[i][0]];
                letter.push(suffixes[i]);
                formated[suffixes[i][0]] = letter;
            }
        }
        for (var key in formated) {
            formated[key].sort(function(a, b) {
                return a.length - b.length;
            });
        }
        // print the suffixes object to the document
        document.write(JSON.stringify(formated));
    }
    // all resources have loaded
    if (document.readyState == "complete") {
        // get the suffixes
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", get_suffixes);
        // append timestamp to url to bypass cache
        xhr.open("GET", "https://publicsuffix.org/list/public_suffix_list.dat?t=" + ((new Date()).getTime()));
        xhr.send(null);
    }
};
