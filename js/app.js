document.onreadystatechange = function() {
    "use strict";
    /* [functions.utils] */
    /**
     * @description [Format passed url_object to include the error info.]
     * @param  {Object} url_object [The url object to update w/ error info.]
     * @param  {Object} error_info [Object containing the error properies to add to url_object.]
     * @return {Object}            [The url_object now updated with error properties.]
     */
    function error(url_object, error_info) {
        // update url_object
        url_object.valid = false;
        url_object.error = error_info.msg;
        url_object.step = error_info.step;
        // remove parsing keys
        return url_object;
    }
    /**
     * @description [Makes an new url_object.]
     * @param  {String} url [The provided url string to parse.]
     * @return {Object}     [The newly made url_object.]
     */
    function new_url_object(url) {
        return {
            "valid": true,
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
    /**
     * @description [Updates url object with provided properties.]
     * @param  {Object} url_object [The url object to update.]
     * @param  {Object} properties [Object containing the properties which will be updated.]
     * @return {Object}            [The updated url_object.]
     */
    function update_url_object(url_object, properties) {
        for (var prop in properties) {
            if (properties.hasOwnProperty(properties)) {
                // update url_object
                url_object[prop] = properties[prop];
            }
        }
        // url object now updated so return
        return url_object;
    }
    /**
     * @description [App error messages.]
     * @type {Object}
     */
    var error_messages = {
        "step_1": "Invalid URL. Contains invalid characters like spaces and/or `\"<>",
        "step_2": "Invalid URL. Does not contain a tld.",
        "step_3": "Invalid URL. Does not contain a valid tld."
    };
    /**
     * @description [Checks url for the presence of any illegal characters.]
     * @param  {Object} url_object [The url object to work with.]
     * @return {Boolean}           [Returns true if any illegal are found in the url. Otherwise false.]
     */
    function illegal_chars(url_object) {
        // step 1: check for illegal characters
        // Allowed: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=
        // Illegal: `"<> and the space " ". These chars must be escaped if used.
        // (source)[http://stackoverflow.com/questions/1547899/which-characters-make-a-url-invalid]
        return ((new RegExp(/`|"|<|>| /)).test(url_object.url) ? true : false);
    }
    /**
     * @description [Checks wether url has any tlds.]
     * @param  {Object} url_object [The url_object to check against.]
     * @return {Boolean}            [Get tld match count and flip boolean. (i.e. having matches returns false, no matches returns true. a match count of !2 => false and no count !0 => true)]
     */
    function no_tld(url_object) {
        // step 2: check for tlds
        // find all tlds by matching anything but what is included in regex.
        // match pattern => [periods/hyphens/and any letter character in any language]/
        // characters to escape: . \ + * ? [ ^ ] $ ( ) { } = ! < > | : -
        // (source)[http://stackoverflow.com/questions/5105143/list-of-all-characters-that-should-be-escaped-before-put-in-to-regex]
        // get the tld matches
        var tld_matches = (url_object.url.match(/\.([^~`\!@#\$%\^&\*\(\)_\+\=\[\]\{\}\\\|;\:'"<\>,\/\?])+[\/|:\/]/gi) || []);
        // add matches to url object
        url_object.tld_matches = tld_matches;
        return (!(tld_matches.length) ? true : false);
    }
    /**
     * @description [Finds the valid tld, if any.]
     * @param  {Object} url_object [The url_object to work with.]
     * @return {Boolean}           [True => valid tld found. Otherwise false.]
     */
    function no_valid_tld(url_object) {
        // step 3: check for a valid tld
        // get the tld matches
        var tld_matches = url_object.tld_matches;
        // get tld list from the global scope
        var tlds = window.tlds,
            all_tlds = tlds.all,
            with_slds = tlds.with_slds,
            without_slds = tlds.without_slds;
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
                    // console.log("not a country code");
                    // tld (right most part) is anything but a country code
                    // cycle through the all tlds anc check if tls exists
                    for (var level in all_tlds) {
                        // *ignore the country codes
                        if (all_tlds[level] === "country_code") continue;
                        // loop through all others
                        if (all_tlds[level].indexOf(tld) !== -1) {
                            url_object.tld = tld;
                            return true;
                        }
                    }
                } else { // is a country code
                    // console.log("is a country code");
                    // check if tld has any slds
                    if (without_slds.indexOf(tld) === -1) { // has slds
                        // console.log("tld has allowed slds", tld);
                        // check if sld is an allowed sld
                        var sld = tld_parts[j + 1];
                        if (!sld) {
                            // console.log("no sld provided");
                            return false;
                        }
                        if (with_slds[tld].indexOf(sld) !== -1) { // allowed sld
                            // console.log('the sld is allowed');
                            // add the sld to the tld
                            url_object.tld = sld + "." + tld;
                            return true;
                        } else {
                            // console.log("the sld is not allowed; invalid url");
                            // invalid sld
                            return false;
                        }
                    } else { // does not have any slds
                        // console.log('tld does not have any slds');
                        url_object.tld = tld;
                        return true;
                    }
                }
            }
        }
        // nothing found return
        return false;
    }
    /**
     * @description [Get the tld index.]
     * @param  {Object} url_object [The url_object to work with.]
     * @return {Number}            [The index of the tld.]
     */
    function get_tld_index(url_object) {
        // step 4: get tld index
        return url_object.url.indexOf(url_object.tld);
    }
    /**
     * @description [Set tld index.]
     * @param {Obkect} url_object   [The url_object to work with.]
     * @param {Number} tld_index [The tld index.]
     */
    function set_tld_index(url_object, tld_index) {
        // step 4: set tld index
        url_object.tld_index_start = tld_index;
        url_object.tld_index_end = tld_index + url_object.tld.length;
    }
    /**
     * @description [Add trailing slash to url if not originaly there.]
     * @param {Object} url_object [The url_object to work this.]
     */
    function add_traling_slash(url_object) {
        var untouched_url = url_object.url_untouched;
        // add traling slash or missing
        url_object.url = untouched_url + ((untouched_url.charAt(untouched_url.length - 1) === "/") ? "" : "/");
        // add the url length to the url_object
        url_object.length = url_object.url.length;
    }
    /**
     * @description [Gets what is left to and right of the tld and adds it to the url_object.]
     * @param  {Object} url_object [The url_object to work with.]
     */
    function break_url(url_object) {
        var url = url_object.url;
        url_object.left = url.substring(0, url_object.tld_index_end);
        url_object.right = url.substring(url_object.tld_index_end, url_object.length);
    }
    /**
     * @description [Parses left of url for scheme, auth, subdomains, & domain. What's to the LEFT of the tld.]
     * @param  {Object} url_object [The url_object to work with.]
     * @return {Boolean}           [Returns true if parsing was successful. Otherwise, return false.]
     */
    function work_left(url_object) {
        // left side format: http://username:password@www.subdomain.example.com/
        // step 6.0: before anything remove the tld
        // remove the tld from the left
        url_object.left = url_object.left.replace("." + url_object.tld, "");
        // step 6.1: get scheme
        var schemes = ["https://", "http://", "file://", "ftp://", "sftp://", "mysql://", "mailto://", "data:", /*camera Real Time Streaming scheme*/ "rtsp://", /*microsoft media server*/ "mms://", "hdfs://", "s3://", "s3n://", "s3bfs://", /*when not provided, i.e. google.com, scheme is set to null as it is not neccessary*/ null];
        var scheme = ((url_object.left.match(/^[a-z][a-z0-9\-]+\:\/\//gi) || [])[0]) || null;
        // check if scheme is in whitelist
        if (schemes.indexOf(scheme) === -1) return error(url_object, { "msg": "No valid scheme.", "step": "work_left:scheme:1" });
        // remove the scheme from the left
        if (scheme) url_object.left = (url_object.left.replace(scheme, ""));
        // add scheme to object
        url_object.scheme = (scheme) ? scheme.replace("://", "") : scheme;
        // step 6.2: get domain name
        // if the left is empty here there is no domain or anything else and pointless to continue parsing
        // if (url_object.left === "") return error(url_object, { "msg": "No domain.", "step": "work_left:domain:1.1" });
        // get domain
        var domain = (url_object.left.match(/[a-z0-9\-]+$/i) || [])[0];
        // if no domain return error
        if (!domain) return error(url_object, { "msg": "No domain.", "step": "work_left:domain:1" });
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
                url_object.subdomains.push(subdomains[i]);
            }
        }
        // 6.5: remove left property. no longer needed
        delete url_object.left;
        // left parsed successfully!
        return true;
    }
    /**
     * @description [Parses right of url for port, query, parameters, & fragment. What's to the RIGHT of the tld.]
     * @param  {Object} url_object [The url_object to work with.]
     * @return {Boolean}           [Returns true if parsing was successful. Otherwise, return false.]
     */
    function work_right(url_object) {
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
        // step 7.3: get fragment
        var fragment_index = url_object.right.indexOf("#");
        if (fragment_index !== -1) { // has fragment
            // set fragment
            url_object.fragment = url_object.right.substring(fragment_index + 1, url_object.right.length - 1);
            // remove fragment from right
            url_object.right = url_object.right.substring(0, fragment_index);
        }
        // step 7.4: get query
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
        // step: 7.5 reset path
        url_object.path = url_object.right;
        // step 7.6: remove right property. no longer needed
        delete url_object.right;
        return true;
    }
    /**
     * @description [Adds the hostname property to the url_object.]
     * @param {Object} url_object [The url_object to work with.]
     */
    function set_hostname(url_object) {
        // get subdomains
        var subdomains = url_object.subdomains;
        // add hostname prop to object
        url_object.hostname = ((subdomains.length) ? (subdomains.join(".") + ".") : "") + url_object.domain + "." + url_object.tld;
    }
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
        // rename a url_untouch
        var original_url = url_object.url_untouched;
        delete url_object.url_untouched;
        url_object.url = original_url;
    }
    /**
     * @description [Parses given url.]
     * @param  {String} url [The provided url string.]
     * @return {Object}     [The url_object containing the url parts.]
     */
    function parse_url(url) {
        // setup url object
        var url_object = new_url_object(url);
        // setp 0: add trailing slash if missing
        add_traling_slash(url_object);
        // step 1: check for illegal characters
        if (illegal_chars(url_object)) return error(url_object, { "msg": "Contains invalid characters like spaces|`|\"|<|>", "step": "illegal_chars" });
        // console.log("111");
        // step 2: find tlds
        if (no_tld(url_object)) return error(url_object, { "msg": "No tld found.", "step": "no_tld" });
        // console.log("222");
        // step 3: validate tlds
        if (!no_valid_tld(url_object)) return error(url_object, { "msg": "No valid tld found.", "step": "no_valid_tld" });
        // console.log("333");
        // step 4: get and set tld index
        set_tld_index(url_object, get_tld_index(url_object));
        // step 5: break into left and right
        break_url(url_object);
        // url format => scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
        // (source)[https://en.wikipedia.org/wiki/Uniform_Resource_Locator]
        // step 6: work left side  => scheme:[//[user:password@]host[:port]]
        var left = work_left(url_object);
        if (left !== true) return left;
        // step 7: work right side => [/]path[?query][#fragment]
        var right = work_right(url_object);
        if (right !== true) return right;
        // step 8: set hostname
        set_hostname(url_object);
        // step 9: cleanup by removing unneeded properties
        cleanup(url_object);
        console.log("PASSING: ", url_object);
    }
    // add to global scope for easy access while developing
    window.parse_url = parse_url;
    // all resources have loaded
    if (document.readyState == "complete") {}
};
