document.onreadystatechange = function() {
    "use strict";
    /* [functions.utils] */
    /**
     * @description [Removes unneeded porperties from url_object and resets url property to originally provided url.]
     * @param {Object} url_object [The url_object to work with.]
     */
    function cleanup(url_object) {
        // cache original url for later use
        var original_url = url_object.url_untouched;
        // names of keys to remove
        var keys = ["length", "tld_index_start", "tld_index_end", "tld_matches", "cleaned_tld", "left", "right", "url_untouched"];
        for (var i = 0, l = keys.length; i < l; i++) delete url_object[keys[i]];
        // reset url to the ogirinally provided url
        url_object.url = original_url;
    }
    /**
     * @description [Parsing error messages.]
     * @type {Object}
     */
    var errors = {
        "empty_string": "URL string cannot be empty.",
        "illegal_chars": "URL cannot contain: backticks (`), empty spaces, backslashes (\\), and less than (<) or greater signs (>).",
        "no_possible_tlds": "URL does not contain possible TLDs.",
        "no_cleaned_tlds": "URL does not contain any TLDs.",
        "no_sld_provided": "URL does not contain a SLD.",
        "cc_sld_mismatch": "URL ccTLD matchup is invalid.",
        "tld_validation_failed": "URL does not contain a valid TLD.",
        "non_cc_tld_valitation_fail": "URLs TLD is a non-ccTLD and failed non-ccTLD validation; TLD seems to not exist.",
        "no_valid_tld": "No valid tld found.",
        "no_scheme": "No valid scheme.",
        "no_domain": "No domain.",
        "invalid_sudomain": "URL contains an wrongly formated subdomain."
    };
    /**
     * @description [Create error message and adds it to url_object.]
     * @param {Object} url_object   [The url_object to work with.]
     * @param {String} message_name [The message name.]
     */
    function error(url_object, message_name) {
        // update url_object
        url_object.error = "name=" + message_name + ";human=" + errors[message_name];
    }
    /**
     * @description [Makes a new url_object.]
     * @param {String} url [The provided url string to parse.]
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
         * @description [Determines whether provided URL string is empty. Sets error if so.]
         * @param {Object} url_object [The url_object to work with.]
         */
        "is_empty": function(url_object) {
            if (url_object.url === "") error(url_object, "empty_string");
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
         * @description [Checks url for presence of illegal characters. Sets error if so.]
         * @param {Object} url_object [The url_object to work with.]
         */
        "illegal_chars": function(url_object) {
            // Allowed: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=
            // Illegal: `"<> and the space " ". These chars must be escaped if used.
            // (source)[http://stackoverflow.com/questions/1547899/which-characters-make-a-url-invalid]
            // if contains illegal chars...set error
            if ((new RegExp(/`|"|<|>| /)).test(url_object.url)) error(url_object, "illegal_chars");
        },
        /**
         * @description [Gets any possible TLDs.]
         * @param {Object} url_object [The url_object to work with.]
         */
        "get_tlds": function(url_object) {
            // find all tlds by matching anything but what is included in regex.
            // match pattern => [periods/hyphens/and any letter character in any language]/
            // characters to escape: . \ + * ? [ ^ ] $ ( ) { } = ! < > | : -
            // (source)[http://stackoverflow.com/questions/5105143/list-of-all-characters-that-should-be-escaped-before-put-in-to-regex]
            // get the tld matches
            var tld_matches = (url_object.url.match(/(\.|\:\/\/|@)([^~`\!@#\$%\^&\*\(\)_\+\=\[\]\{\}\\\|;\:'"<\>,\/\?])+[\/|:\/]/gi) || []);
            // if no tld matches...set error
            if (!tld_matches.length) return error(url_object, "no_possible_tlds");
            // check matches
            var cleaned_matches = [];
            loop1:
                for (var i = 0, l = tld_matches.length; i < l; i++) {
                    var tld_match = tld_matches[i].replace(/^[\:\/\/|\.|@]+|\:$/g, ""),
                        tld_match_parts = tld_match.split("."),
                        ll = tld_match_parts.length;
                    // matches must have at least 2 levels
                    if (ll <= 1) {
                        // only allow 1 tld present if it is localhost
                        // anything else is not allowed
                        if (tld_match !== "localhost/") continue;
                    }
                    // now check that there are no empty levels. (i.e. google..com, multiple periods)
                    for (var j = 0; j < ll; j++) {
                        if (tld_match_parts[j] === "") {
                            // skip inner loop and continue with the outer loop
                            // a tld within this match is empty
                            continue loop1;
                        }
                    }
                    // everything good with the tld_match
                    cleaned_matches.push(tld_matches[i]);
                }
                // if no cleaned tlds...set error
            if (!cleaned_matches.length) return error(url_object, "no_cleaned_tlds");
            // add matches to url object
            url_object.tld_matches = cleaned_matches;
        },
        /**
         * @description [Goes over list of cleaned TLDs and tried t validate them. Uses the first valid TLD as the URL TLD.]
         * @param {Object} url_object [The url_object to work with.]
         */
        "validate_tld": function(url_object) {
            // get the tld matches
            var tld_matches = url_object.tld_matches;
            // get tld list from the global scope
            var tlds = window.constants.tlds,
                all_tlds = tlds.all,
                with_slds = tlds.with_slds,
                without_slds = tlds.without_slds,
                top_domains = tlds.top_domains;
            // loop through the tlds
            for (var i = 0, l = tld_matches.length; i < l; i++) {
                // remove starting dot(.)|:// and ending slash(/)|colon(:)
                var current_tld = tld_matches[i].replace(/^[\.|\:\/\/]+|[\/|\:]+$/g, "");
                // get dot delimeter count
                // start with the most right and move left
                var tld_parts = current_tld.split(".").reverse();
                for (var j = 0, ll = tld_parts.length; j < ll; j++) {
                    // cache the tld
                    var tld = tld_parts[j];
                    // check if tld is a country code
                    if (all_tlds.country_code.indexOf(tld) === -1) { // not a country code
                        // tld (right most part) is anything but a country code
                        // cycle through the all tlds anc check if tls exists
                        for (var level in all_tlds) {
                            // *ignore the country codes
                            if (all_tlds[level] === "country_code") continue;
                            // loop through all others
                            if (all_tlds[level].indexOf(tld) !== -1) {
                                // check if domain is a top 10,000 domain
                                if (top_domains.indexOf(tld_parts[j + 1] + "." + tld) !== -1) url_object.top_domain = true;
                                // add tld to url_object
                                url_object.tld = tld;
                                url_object.cleaned_tld = tld_matches[i];
                                return;
                            }
                        }
                        // for non countryTLD the TLD must be the part at the very right
                        // therefore if this righmost item does not match anything
                        // the URL is invalid. TLD needs to be in a level.
                        return error(url_object, "non_cc_tld_valitation_fail");
                    } else { // is a country code
                        // check if tld has any slds
                        if (without_slds.indexOf(tld) === -1) { // tld has allowed slds
                            // check if sld is an allowed sld
                            var sld = tld_parts[j + 1];
                            if (!sld) { // no sld provided
                                return error(url_object, "no_sld_provided");
                            }
                            if (with_slds[tld].indexOf(sld) !== -1) { // sld is allowed
                                // check if domain is in top 10,000 domains
                                if (top_domains.indexOf(tld_parts[j + 1] + "." + tld) !== -1) url_object.top_domain = true;
                                // add the sld to the tld
                                url_object.tld = sld + "." + tld;
                                url_object.cleaned_tld = tld_matches[i];
                                return;
                            } else {
                                // invalid sld
                                return error(url_object, "cc_sld_mismatch");
                            }
                        } else { // tld does not have any slds
                            url_object.tld = tld;
                            url_object.cleaned_tld = tld_matches[i];
                            return;
                        }
                    }
                }
            }
            // nothing found return
            return error(url_object, "tld_validation_failed");
        },
        /**
         * @description [Using the valid TLD as a split point, function splits URL into a left(start of URL to TLD) and right(everything past the TLD to end of URL) substring.]
         * @param {Object} url_object [The url_object to work with.]
         */
        "split_url": function(url_object) {
            // get the tld index
            var tld_index = url_object.url.indexOf(url_object.cleaned_tld),
                tld_split_coint = tld_index + url_object.cleaned_tld.length - 1;
            // set breaks
            url_object.left = url_object.url.substring(0, tld_split_coint);
            url_object.right = url_object.url.substring(tld_split_coint, url_object.url.length);
        },
        /**
         * @description [Parses left of URL for scheme, auth, subdomains, & domain.]
         * @param {Object} url_object [The url_object to work with.]
         */
        "work_left": function(url_object) {
            // left side format: http://username:password@www.subdomain.example.com/
            // (§) BEFORE ANYTHING REMOVE THE TLD
            // remove the tld from the left
            // skip this for localhost
            if (url_object.tld !== "localhost") url_object.left = url_object.left.replace(new RegExp("\." + url_object.tld + "$"), "");
            // (§) GET SCHEME
            var scheme = ((url_object.left.match(/^[a-z][a-z0-9\-]+\:\/\//gi) || [])[0]) || null;
            // check if scheme is in whitelist
            if (window.constants.schemes.indexOf(scheme) === -1) return error(url_object, "no_scheme");
            // remove the scheme from the left
            if (scheme) url_object.left = (url_object.left.replace(new RegExp("^" + scheme), ""));
            // add scheme to object
            url_object.scheme = (scheme) ? scheme.replace("://", "") : scheme;
            // (§) GET DOMAIN NAME
            // if the left is empty here there is no domain or anything else and pointless to continue parsing
            // if (url_object.left === "") return error(url_object, "no_domain");
            var domain = (url_object.left.match(/[a-z0-9\-]+$/i) || [])[0];
            // if no domain..set error
            if (!domain) return error(url_object, "no_domain");
            // else... remove the domain from the left
            url_object.left = (url_object.left.replace(domain, ""));
            // add domain to object
            url_object.domain = domain;
            // (§) GET AUTH
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
            // (§) GET SUBDOMAINS
            var subdomains = url_object.left.replace(/\.$/, "").trim();
            if (subdomains !== "") {
                subdomains = subdomains.split(".");
                for (var i = 0, l = subdomains.length; i < l; i++) {
                    // add the subdomains to subdomains array if subdomain...
                    // ...is valid (cant start with a - and cannot contain special chars)
                    // (source)[http://stackoverflow.com/questions/7111881/what-are-the-allowed-characters-in-a-sub-domain]
                    if (subdomains[i].replace(/[^~`\!@#\$%\^&\*\(\)_\+\=\[\]\{\}\\\|;\:'"<\>,\.\/\?]/g, "") === "") {
                        url_object.subdomains.push(subdomains[i]);
                    } else return error(url_object, "invalid_sudomain");
                }
            }
            // left parsed successfully!
        },
        /**
         * @description [Parses right of URL for port, query, parameters, & fragment.]
         * @param {Object} url_object [The url_object to work with.]
         */
        "work_right": function(url_object) {
            // (§) EXTRACT PORT IF PRESENT
            var port_matches = (url_object.right.match(/^\:(\d+)?\//) || []);
            if (port_matches.length) {
                // set port
                url_object.port = ((port_matches[0] === ":/") ? null : port_matches[0].replace(/\:|\//g, ""));
                // remove port from right
                url_object.right = "/" + url_object.right.replace(port_matches[0], "");
            }
            // (§) SET URL_OBJECT PATH
            url_object.path = url_object.right;
            // (§) GET FRAGMENT
            var fragment_index = url_object.right.indexOf("#");
            if (fragment_index !== -1) { // has fragment
                // set fragment
                url_object.fragment = url_object.right.substring(fragment_index + 1, url_object.right.length - 1);
                // remove fragment from right
                url_object.right = url_object.right.substring(0, fragment_index);
            }
            // (§) GET QUERY
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
            // (§) RESET PATH
            url_object.path = url_object.right;
            // right parsed successfully!
        },
        /**
         * @description [Adds the hostname property to url_object.]
         * @param {Object} url_object [The url_object to work with.]
         */
        "set_hostname": function(url_object) {
            // get subdomains
            var subdomains = url_object.subdomains,
                tld = url_object.tld;
            // add hostname prop to object
            // if the tld === localhost, use an empty string
            url_object.hostname = ((subdomains.length) ? (subdomains.join(".") + ".") : "") + url_object.domain + (tld !== "localhost" ? ("." + tld) : "");
        },
        /**
         * @description [Empty function must be called as last step trigger final parsability check.]
         */
        "final_check": function() {}
    };
    /**
     * @description [Parses given url.]
     * @param {String} string [The provided url.]
     * @return {Object}        [The url_object containing the url parts.]
     */
    function parse_url(string) {
        // setup url object
        var url = url_object(string);
        var algorithm = ["is_empty", "add_traling_slash", "illegal_chars", "get_tlds", "validate_tld", "split_url", "work_left", "work_right", "set_hostname", "final_check"];
        // loop through all parsing steps
        for (var i = 0, l = algorithm.length; i < l; i++) {
            // if url is invalid stop function execution
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
    // if (document.readyState == "complete") {}
};
