document.onreadystatechange = function() {
    "use strict";
    /* [functions.utils] */
    /**
     * @description [Removes unneeded porperties from the url_object and resets the url property.]
     * @param  {Object} url_object [The url_object to work with.]
     */
    function cleanup(url_object) {
        // remove unneeded keys
        delete url_object.length;
        delete url_object.tld_index_start;
        delete url_object.tld_index_end;
        delete url_object.tld_matches;
        delete url_object.cleaned_tld;
        // rename a url_untouch
        var original_url = url_object.url_untouched;
        delete url_object.url_untouched;
        url_object.url = original_url;
    }
    /**
     * @description [Parsing messages.]
     * @type {Object}
     */
    var error_messages = {
        "empty_string": "URL string cannot be empty.",
        "illegal_chars": "URL cannot contain: backticks (`), empty spaces, backslashes (\\), and less than (<) or greater signs (>).",
        "get_tlds": "URL does not contain possible TLDs.",
        "no_sld_provided": "URL does not contain a SLD.",
        "cc_sld_mismatch": "URL ccTLD matchup is invalid.",
        "tld_validation_failed": "URL does not contain a valid TLD.",
        "non_cc_tld_valitation_fail": "URLs TLD is a non-ccTLD and failed non-ccTLD validation; TLD seems to not exist.",
        "no_valid_tld": "No valid tld found.",
        "work_left:scheme:1": "No valid scheme.",
        "work_left:domain:1": "No domain.",
        "no_scheme": "No valid scheme.",
        "no_domain": "No domain.",
        "invalid_sudomain": "URL contains an wrongly formated subdomain."
    };
    /**
     * @description [Format passed url_object to include the error info.]
     * @param  {Object} url_object   [The url object to update w/ error info.]
     * @param  {Object} message_name [Object containing the error properies to add to url_object.]
     * @return {Object}              [The url_object now updated with error properties.]
     */
    function error(url_object, message_name) {
        // update url_object
        url_object.error = "name=" + message_name + ";human=" + error_messages[message_name];
    }
    /**
     * @description [Makes an new url_object.]
     * @param  {String} url [The provided url string to parse.]
     * @return {Object}     [The newly made url_object.]
     */
    function url_object(url) {
        return {
            "error": false,
            "top_domain": false,
            "url_untouched": url,
            "url": url,
            "scheme": null,
            "username": null,
            "password": null,
            "subdomains": [],
            "domain": null,
            "tld": null,
            "hostname": null,
            "port": null,
            "path": null,
            "query": null,
            "parameters": {},
            "fragment": null
        };
    }
    var steps = {
        /**
         * @description [Determines whether provided URL string is empty. If so mark as invalid.]
         * @param  {Object} url_object [The url object to work with.]
         */
        "is_empty": function(url_object) {
            if (url_object.url === "") {
                error(url_object, "empty_string");
            }
        },
        /**
         * @description [Add trailing slash to url if not originaly there.]
         * @param {Object} url_object [The url_object to work this.]
         */
        "add_traling_slash": function(url_object) {
            var untouched_url = url_object.url_untouched;
            // add traling slash or missing
            url_object.url = untouched_url + ((untouched_url.charAt(untouched_url.length - 1) === "/") ? "" : "/");
            // add the url length to the url_object
            url_object.length = url_object.url.length;
        },
        /**
         * @description [Checks url for the presence of any illegal characters.]
         * @param  {Object} url_object [The url object to work with.]
         * @return {Boolean}           [Returns true if any illegal are found in the url. Otherwise false.]
         */
        "illegal_chars": function(url_object) {
            // step 1: check for illegal characters
            // Allowed: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=
            // Illegal: `"<> and the space " ". These chars must be escaped if used.
            // (source)[http://stackoverflow.com/questions/1547899/which-characters-make-a-url-invalid]
            // if contains illegal chars...set error
            if ((new RegExp(/`|"|<|>| /)).test(url_object.url)) error(url_object, "illegal_chars");
        },
        /**
         * @description [Gets matchable tlds.]
         * @param  {Object} url_object [The url_object to check against.]
         */
        "get_tlds": function(url_object) {
            // step 2: check for tlds
            // find all tlds by matching anything but what is included in regex.
            // match pattern => [periods/hyphens/and any letter character in any language]/
            // characters to escape: . \ + * ? [ ^ ] $ ( ) { } = ! < > | : -
            // (source)[http://stackoverflow.com/questions/5105143/list-of-all-characters-that-should-be-escaped-before-put-in-to-regex]
            // get the tld matches
            var tld_matches = (url_object.url.match(/\.([^~`\!@#\$%\^&\*\(\)_\+\=\[\]\{\}\\\|;\:'"<\>,\/\?])+[\/|:\/]/gi) || []);
            // if no tld matches...set error
            if (!tld_matches.length) {
                error(url_object, "get_tlds");
                return;
            }
            // check matches
            var cleaned_matches = [];
            loop1:
                for (var i = 0, l = tld_matches.length; i < l; i++) {
                    var tld_match = tld_matches[i].replace(/^\.|\:$/g, "").split("."),
                        ll = tld_match.length;
                    // matches must have at least 2 levels
                    if (ll <= 1) continue;
                    // now check that there are no empty levels. (i.e. google..com, multiple periods)
                    for (var j = 0; j < ll; j++) {
                        if (tld_match[j] === "") {
                            // skip inner loop and continue with the outer loop
                            // a tld within this match is empty
                            continue loop1;
                        }
                    }
                    // everything good with the tld_match
                    cleaned_matches.push(tld_matches[i]);
                }
                // finally check for cleaned match count
            if (!cleaned_matches.length) {
                error(url_object, "get_tlds");
                return;
            }
            // add matches to url object
            url_object.tld_matches = cleaned_matches;
        },
        /**
         * @description [Finds the valid tld, if any.]
         * @param  {Object} url_object [The url_object to work with.]
         * @return {Boolean}           [True => valid tld found. Otherwise false.]
         */
        "validate_tld": function(url_object) {
            // step 3: check for a valid tld
            // get the tld matches
            var tld_matches = url_object.tld_matches;
            // get tld list from the global scope
            var tlds = window.tlds,
                all_tlds = tlds.all,
                with_slds = tlds.with_slds,
                without_slds = tlds.without_slds,
                top_domains = tlds.top_domains;
            // loop through the tlds
            for (var i = 0, l = tld_matches.length; i < l; i++) {
                // remove starting dot(.) and ending slash(/)
                var current_tld = tld_matches[i].replace(/^\.|[\/|\:]$/g, "");
                // get dot delimeter count
                // start with the most right and move left
                var tld_parts = current_tld.split(".").reverse(); // ["google", "co", "uk"]
                for (var j = 0, ll = tld_parts.length; j < ll; j++) {
                    // cache the tld
                    var tld = tld_parts[j];
                    // check if tld is a country code
                    if (all_tlds.country_code.indexOf(tld) === -1) { // not a country code
                        console.log("not a country code");
                        // tld (right most part) is anything but a country code
                        // cycle through the all tlds anc check if tls exists
                        for (var level in all_tlds) {
                            // *ignore the country codes
                            if (all_tlds[level] === "country_code") continue;
                            // loop through all others
                            if (all_tlds[level].indexOf(tld) !== -1) {
                                console.log("111", tld);
                                // check if domain is a top 10,000 domain
                                if (top_domains.indexOf(tld_parts[j + 1] + "." + tld) !== -1) url_object.top_domain = true;
                                // console.log(">>>>>>>", tld_matches[i]);
                                // add tld to url_object
                                url_object.tld = tld;
                                url_object.cleaned_tld = tld_matches[i];
                                return;
                            }
                        }
                        // for non countryTLD the TLD must be the part at the very right
                        // therefore if this righmost item does not match anything
                        // the URL is invalid. TLD needs to be in a level.
                        // console.log("222", tld_parts);
                        error(url_object, "non_cc_tld_valitation_fail");
                        return;
                    } else { // is a country code
                        console.log("is a country code");
                        // check if tld has any slds
                        if (without_slds.indexOf(tld) === -1) { // has slds
                            console.log("tld has allowed slds", tld);
                            // check if sld is an allowed sld
                            var sld = tld_parts[j + 1];
                            if (!sld) {
                                console.log("no sld provided");
                                error(url_object, "no_sld_provided");
                                return;
                            }
                            if (with_slds[tld].indexOf(sld) !== -1) { // allowed sld
                                console.log('the sld is allowed');
                                // check if domain is a top 10,000 domain
                                if (top_domains.indexOf(tld_parts[j + 1] + "." + tld) !== -1) url_object.top_domain = true;
                                // add the sld to the tld
                                url_object.tld = sld + "." + tld;
                                url_object.cleaned_tld = tld_matches[i];
                                return;
                            } else {
                                // invalid sld
                                error(url_object, "cc_sld_mismatch");
                                return;
                            }
                        } else { // does not have any slds
                            console.log('tld does not have any slds');
                            url_object.tld = tld;
                            url_object.cleaned_tld = tld_matches[i];
                            return;
                        }
                    }
                }
            }
            // nothing found return
            error(url_object, "tld_validation_failed");
            return;
        },
        "split_url": function(url_object) {
            // get the tld index
            var tld_index = url_object.url.indexOf(url_object.cleaned_tld);
            var tld_split_coint = tld_index + url_object.cleaned_tld.length - 1;
            // set breaks
            url_object.left = url_object.url.substring(0, tld_split_coint);
            url_object.right = url_object.url.substring(tld_split_coint, url_object.url.length);
        },
        /**
         * @description [Parses left of url for scheme, auth, subdomains, & domain. What's to the LEFT of the tld.]
         * @param  {Object} url_object [The url_object to work with.]
         * @return {Boolean}           [Returns true if parsing was successful. Otherwise, return false.]
         */
        "work_left": function(url_object) {
            console.log("INSIDE")
                // left side format: http://username:password@www.subdomain.example.com/
                // step 6.0: before anything remove the tld
                // remove the tld from the left
                // console.log("????????????", url_object.left, url_object.tld);
            url_object.left = url_object.left.replace(new RegExp("\." + url_object.tld + "$"), "");
            // console.log("????????????", url_object.left);
            // step 6.1: get scheme
            var schemes = ["https://", "http://", "file://", "ftp://", "sftp://", "mysql://", "mailto://", "data:", /*camera Real Time Streaming scheme*/ "rtsp://", /*microsoft media server*/ "mms://", "hdfs://", "s3://", "s3n://", "s3bfs://", /*when not provided, i.e. google.com, scheme is set to null as it is not neccessary*/ null];
            var scheme = ((url_object.left.match(/^[a-z][a-z0-9\-]+\:\/\//gi) || [])[0]) || null;
            // check if scheme is in whitelist
            if (schemes.indexOf(scheme) === -1) {
                error(url_object, "no_scheme");
                return;
            }
            // remove the scheme from the left
            if (scheme) url_object.left = (url_object.left.replace(new RegExp("^" + scheme), ""));
            // add scheme to object
            url_object.scheme = (scheme) ? scheme.replace("://", "") : scheme;
            // step 6.2: get domain name
            // if the left is empty here there is no domain or anything else and pointless to continue parsing
            // if (url_object.left === "") return error(url_object, { "msg": "No domain.", "step": "work_left:domain:1.1" });
            // get domain
            var domain = (url_object.left.match(/[a-z0-9\-]+$/i) || [])[0];
            // if no domain..set error
            if (!domain) {
                error(url_object, "no_domain");
                return;
            }
            // else... remove the domain from the left
            url_object.left = (url_object.left.replace(domain, ""));
            // add domain to object
            url_object.domain = domain;
            // step 6.3: get auth
            var auth_index = url_object.left.indexOf("@");
            if (auth_index !== -1) {
                // remove the auth from the left into its own property
                url_object.auth = (url_object.left.substring(0, auth_index) || ":");
                // reset the left
                url_object.left = url_object.left.substring(auth_index, url_object.left.length - 1);
                // parse auth
                var auth = url_object.auth;
                var colon_index = auth.indexOf(":");
                if (colon_index !== -1) { // has :
                    // username + password, username only, password only, or : only
                    var auth_parts = auth.split(":");
                    url_object.username = (auth_parts[0] || null);
                    url_object.password = (auth_parts[1] || null);
                } else {
                    // only username or nothing
                    if (auth !== "") url_object.username = auth;
                }
            } else {
                url_object.auth = ":";
            }
            // remove the @ sign
            url_object.left = url_object.left.replace(/^@/, "");
            // step 6.4: get subdomains
            var subdomains = url_object.left.replace(/\.$/, "").trim();
            if (subdomains !== "") {
                subdomains = subdomains.split(".");
                for (var i = 0, l = subdomains.length; i < l; i++) {
                    // add the subdomains to subdomains array
                    // check if subdomain is valid
                    // 1. cant start with a - and cannot contain special chars
                    // (source)[http://stackoverflow.com/questions/7111881/what-are-the-allowed-characters-in-a-sub-domain]
                    if (subdomains[i].replace(/[^~`\!@#\$%\^&\*\(\)_\+\=\[\]\{\}\\\|;\:'"<\>,\.\/\?]/g, "") === "") {
                        url_object.subdomains.push(subdomains[i]);
                    } else {
                        error(url_object, "invalid_sudomain")
                        return;
                        // break;
                    }
                }
            }
            console.log("DONE WITH THE LEFT");
            // 6.5: remove left property. no longer needed
            delete url_object.left;
            // left parsed successfully!
        },
        /**
         * @description [Parses right of url for port, query, parameters, & fragment. What's to the RIGHT of the tld.]
         * @param  {Object} url_object [The url_object to work with.]
         * @return {Boolean}           [Returns true if parsing was successful. Otherwise, return false.]
         */
        "work_right": function(url_object) {
            // step 7.0: extract port if present
            var port_matches = (url_object.right.match(/^\:(\d+)?\//) || []);
            if (port_matches.length) {
                // set port
                url_object.port = ((port_matches[0] === ":/") ? null : port_matches[0].replace(/\:|\//g, ""));
                // remove port from right
                url_object.right = "/" + url_object.right.replace(port_matches[0], "");
            }
            // step 7.1: set url_object path
            url_object.path = url_object.right;
            // step 7.2: get fragment
            var fragment_index = url_object.right.indexOf("#");
            if (fragment_index !== -1) { // has fragment
                // set fragment
                url_object.fragment = url_object.right.substring(fragment_index + 1, url_object.right.length - 1);
                // remove fragment from right
                url_object.right = url_object.right.substring(0, fragment_index);
            }
            // step 7.3: get query
            var query_index = url_object.right.indexOf("?");
            if (query_index !== -1) { // has query
                // set query
                url_object.query = url_object.right.substring(query_index, url_object.right.length - 1);
                // remove query from right
                url_object.right = url_object.right.substring(0, query_index);
                // parse query
                var query = url_object.query.replace(/^\?/, "");
                var parameters = query.split(/;|&/g);
                for (var i = 0, l = parameters.length; i < l; i++) {
                    // cache parameter
                    var parameter = parameters[i].split("=");
                    // store parameter pair
                    url_object.parameters[parameter[0]] = parameter[1];
                }
            }
            // step 7.4: reset path
            url_object.path = url_object.right;
            // step 7.5: remove right property. no longer needed
            delete url_object.right;
        },
        /**
         * @description [Must be called at the end to check if second to last step set validity to false.]
         */
        "final_check": function(url_object) {}
    };
    /**
     * @description [Parses given url.]
     * @param  {String} string [The provided url string.]
     * @return {Object}        [The url_object containing the url parts.]
     */
    function parse_url(string) {
        // setup url object
        var url = url_object(string);
        var algorithm = ["is_empty", "add_traling_slash", "illegal_chars", "get_tlds", "validate_tld", "split_url", "work_left", "work_right", "final_check"];
        // loop through all parsing steps
        for (var i = 0, l = algorithm.length; i < l; i++) {
            // if url is invalid stop function execution
            console.log("STEP:", algorithm[i]);
            if (url.error) break;
            steps[algorithm[i]](url);
        }
        // finally, cleanup
        cleanup(url);
        return url;
    }
    // add to global scope for easy access while developing
    window.parse_url = parse_url;
    // all resources have loaded
    if (document.readyState == "complete") {}
};
