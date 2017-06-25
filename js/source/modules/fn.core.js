/**
 * @description [Contains the "steps" (functions) that are run which parse the provided URL string.]
 * @type {Object}
 */
var steps = {
    /**
     * @description [Determines whether provided URL string is empty. Sets error if so.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "is_empty": function(url_object) {
        if (url_object.url === "") error(url_object, "empty_string");
    },
    /**
     * @description [Determines whether provided URL string meets the min length.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "min_length": function(url_object) {
        // [minimum length](http://www.nic.ag/rules.htm)
        // string length must be at least 4 characters long
        if (url_object.url.length <= 3) error(url_object, "min_length");
    },
    /**
     * @description [Determines the route the string is going to take to parse it.]
     * @param  {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "parser_determination": function(url_object) {
        // get the url
        var url = url_object.url;
        // check for data: & mailto: urls
        if (/^data\:/i.test(url)) {
            // url is a data: url
            // format => data:[<mediatype>][;base64],<data>
            // [https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs]
            // [https://tools.ietf.org/html/rfc2397]
            // [https://en.wikipedia.org/wiki/Data_URI_scheme]
            var mediatype, type, subtype,
                parameters = [],
                data, base64 = false,
                parts;
            // start breaking apart the url
            // remove the prefix
            url = url.replace(/^data\:/, "");
            // check if the url has any parameters
            var parameter_delimiter_index = url.indexOf(";");
            var comma_delimiter_index = url.indexOf(",");
            // for cases like this => data:text/html,<script>alert('hi');</script>
            // the ; delimiter must come before that of the first comma
            if (-~parameter_delimiter_index && parameter_delimiter_index < comma_delimiter_index) {
                // split the string by its semicolons
                parts = url.split(";");
                // loop over the parts
                for (var i = 0, l = parts.length; i < l; i++) {
                    var part = parts[i];
                    var slash_index = part.indexOf("/");
                    var equal_sign_index = part.indexOf("=");
                    var comma_index = part.indexOf(",");
                    // check for the mediatype
                    if (!mediatype && -~slash_index) {
                        // set the type
                        mediatype = part;
                        // get the type and subtype
                        type = mediatype.substring(0, slash_index);
                        subtype = mediatype.substring(slash_index + 1, mediatype.length);
                    }
                    // check for comma + data
                    if (!data && -~comma_index) {
                        // set the data
                        data = part.substring(comma_index + 1, part.length);
                        // set the possible parameter
                        part = part.substring(0, comma_index);
                        // check for base64 extension
                        if (part === "base64") base64 = true;
                        else {
                            // push to the parameters array
                            parameters.push(part);
                        }
                        // stop the loop
                        break;
                    }
                    // check for simple parameter
                    if (-~equal_sign_index) {
                        // push to the parameters array
                        parameters.push(part);
                    }
                }
            } else {
                // no parameters
                var comma_index = url.indexOf(",");
                // this url only contains a mediatype and data
                mediatype = url.substring(0, comma_index);
                data = url.substring(comma_index + 1, url.length);
                // mediatype slash index
                var slash_index = mediatype.indexOf("/");
                // get the type and subtype
                type = mediatype.substring(0, slash_index);
                subtype = mediatype.substring(slash_index + 1, mediatype.length);
            }
            // set the values
            var info = url_object.data;
            info.mediatype = mediatype;
            info.type = type;
            info.subtype = subtype;
            info.parameters = parameters;
            info.data = data;
            info.base64 = base64;
            // set the skip flag in the url_object
            url_object.skip = true;
            // remove the normalized string
            url_object.normalized = null;
        } else if (/^mailto\:/i.test(url)) {
            // resources...
            // [https://yoast.com/dev-blog/guide-mailto-links/]
            // [https://en.wikipedia.org/wiki/Mailto]
            // [https://www.labnol.org/internet/email/learn-mailto-syntax/6748/]
            // [https://www.lifewire.com/mailto-url-elements-1172924]
            // [https://tools.ietf.org/html/rfc6068]
        }
        // for the time being it defaults to a regular url...
        // don't do anything and continue the loop.
    },
    /**
     * @description [Checks URL for presence of illegal characters. Sets error if so.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "illegal_chars": function(url_object) {
        // Allowed: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~:/?#[]@!$&'()*+,;=
        // Illegal: `"<> and the space " ". These chars must be escaped if used.
        // (source)[http://stackoverflow.com/questions/1547899/which-characters-make-a-url-invalid]
        // if contains illegal chars...set error
        // if ((new RegExp(/`|"|<|>| /)).test(url_object.url)) error(url_object, "illegal_chars");
        if ((new RegExp(/\s/))
            .test(url_object.url)) error(url_object, "illegal_chars");
    },
    /**
     * @description [Performs any needed string normalization.]
     * @param  {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "normalize_start": function(url_object) {
        // [https://en.wikipedia.org/wiki/URL_normalization]
        // (§) File URLs
        // [https://en.wikipedia.org/wiki/File_URI_scheme]
        url_object.url = url_object.url.replace("file:///", "file://localhost/");
    },
    /**
     * @description [Gets any possible TLDs.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "get_tlds": function(url_object) {
        // characters to escape: . \ + * ? [ ^ ] $ ( ) { } = ! < > | : -
        // (source)[http://stackoverflow.com/questions/5105143/list-of-all-characters-that-should-be-escaped-before-put-in-to-regex]
        // find all TLDs by matching anything but what is included in regex.
        // match pattern => [periods/hyphens/and any letter character in any language]/
        var tld_matches = (url_object.url.match(/((\.|\:\/\/|@|^)([^~`\!@#\$%\^&\*\(\)_\+\=\[\]\{\}\\\|;\:'"<\>,\/\?])+)|localhost/gi) || []);
        // if no TLD matches...set error
        if (!tld_matches.length) return error(url_object, "no_possible_tlds");
        // check matches
        var cleaned_matches = [];
        var empty_domain = false;
        loop1: for (var i = 0, l = tld_matches.length; i < l; i++) {
                var tld_match = tld_matches[i].replace(/^[\.|\:\/\/|@]+|\:$/g, ""),
                    tld_match_parts = tld_match.split(".");
                // there has to be at least 2 parts to the tld match (domain + suffix)
                // or the tld match must equal to "localhost"
                if (tld_match_parts.length <= 1 && tld_match !== "localhost") continue;
                // now check that there are no empty levels. (i.e. google..com, multiple periods)
                if (-~tld_match.indexOf("..")) {
                    // set the empty domain flag
                    empty_domain = true;
                    // skip inner loop and continue with the outer loop
                    // a TLD within this match is empty
                    continue loop1;
                }
                // everything good with the tld_match
                cleaned_matches.push(tld_matches[i]);
            }
            // if no cleaned TLDs...set error
        if (!cleaned_matches.length) {
            // if the empty_domain flag is set leave the "empty_domain" error
            return error(url_object, (empty_domain ? "empty_domain" : "no_cleaned_tlds"));
        }
        // add matches to url_object
        url_object.tld_matches = cleaned_matches;
    },
    /**
     * @description [Goes over list of cleaned TLDs and tried t validate them. Uses the first valid TLD as the URL tLD.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "validate_tld": function(url_object) {
        // get TLD matches
        var tld_matches = url_object.tld_matches;
        // get TLD list from the global scope
        var tlds = constants.suffixes;
        // loop through the TLDs
        for (var i = 0, l = tld_matches.length; i < l; i++) {
            // remove starting dot(.)|:// and ending slash(/)|colon(:)
            var match = tld_matches[i].replace(/^[\.|\:\/\/|@]+|[\/|\:]+$/g, "");
            var levels = match.split(".");
            var last = levels.pop();
            var others = levels.join(".");
            var others_backup = others;
            var is_punycode = false;
            // get the suffix object
            var suffix_object = tlds[last.toLowerCase()];
            // in the case no suffix object exists check for possible punycode
            // else simply skip the tld match
            if (!suffix_object) {
                // [https://en.wikipedia.org/wiki/Punycode]
                // [https://en.wikipedia.org/wiki/Internationalized_domain_name]
                if ((/^xn--/)
                    .test(last)) { // only allow punycode to pass
                    // convert to punycode to Unicode
                    var conversion;
                    try {
                        conversion = punycode.toUnicode(last);
                        // set the punycode flag
                        is_punycode = true;
                    } catch (e) {
                        return error(url_object, e);
                    }
                    // get the suffix_object
                    suffix_object = tlds[conversion];
                    if (!suffix_object) continue; // skip the iteration as the last tld does not exist
                } else continue; // skip the iteration as the last tld does not exist
            }
            var ll = suffix_object.length;
            // loop over the arrays until something matches
            for (var j = ll - 1; j > -1; j--) {
                // cache the current array
                var current_array = suffix_object[j];
                // on the 0th level set the tld to be the single level tld
                if (j === 0) {
                    // set the tld
                    url_object.tld = last;
                    url_object.cleaned_tld = tld_matches[i];
                    return;
                } else {
                    // convert any punycode to Unicode
                    others = others.split(".");
                    others = others.map(map.punycodeUnicode);
                    others = others.join(".");
                    // check if the others is in the array
                    // loop over the current_array and check if any of the suffixes match the others
                    for (var k = 0, lll = current_array.length; k < lll; k++) {
                        var current_suffix = current_array[k];
                        if ((new RegExp(current_suffix + "$"))
                            .test(others.toLowerCase())) {
                            var left_over = others.replace((new RegExp(current_suffix + "$")), "");
                            // the character before must be a dot or it the matched suffix must
                            // be at the zeroed index of the tld_match
                            if (left_over) {
                                // get the last char
                                var last_char = left_over.charAt(left_over.length - 1);
                                if (last_char !== ".") continue;
                            } else {
                                // there is only a tld, the url is missing all else
                                return error(url_object, "incomplete_url_no_domain");
                            }
                            // cache the last variable
                            var last_ = last;
                            // task the match to the last
                            last = current_suffix + "." + last;
                            // check if the current_suffix needs to be converted back to how
                            // it was originally provided. i.e. unicode or ascii
                            if (!(new RegExp(last + "$"))
                                .test(match)) {
                                // reset back to Unicode
                                var suffix_parts = current_suffix.split(".");
                                suffix_parts = suffix_parts.map(map.punycodeASCII);
                                // reset the last
                                last = suffix_parts + "." + last_;
                            }
                            // set the
                            url_object.tld = last;
                            url_object.cleaned_tld = tld_matches[i];
                            return;
                        }
                    }
                }
            }
        }
        // no tld found
        return error(url_object, "tld_validation_failed");
    },
    /**
     * @description [Using the valid TLD as a split point, function splits URL into a left(start of URL to TLD) and right(everything past the TLD to end of URL) substring.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "split_url": function(url_object) {
        // get the TLD index
        var tld_index = url_object.url.indexOf(url_object.cleaned_tld),
            // tld_split_coint = tld_index + url_object.cleaned_tld.length - 1;
            tld_split_coint = tld_index + url_object.cleaned_tld.length;
        // set breaks
        url_object.left = url_object.url.substring(0, tld_split_coint);
        var right = url_object.url.substring(tld_split_coint, url_object.url.length);
        url_object.right = right;
        url_object.resource = right;
    },
    /**
     * @description [Parses left of URL for scheme, auth, subdomains, & domain.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "work_left": function(url_object) {
        // [https://en.wikipedia.org/wiki/Uniform_Resource_Locator]
        //  scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
        // the problem: there are issues with parenthesis
        // [https://blog.codinghorror.com/the-problem-with-urls/]
        // [https://open.vanillaforums.com/discussion/23947/parentheses-in-a-url-break-the-link]
        // [http://www.blooberry.com/indexdot/html/topics/urlencoding.htm]
        // left side format: http://username:password@www.subdomain.example.com/
        // (§) BEFORE ANYTHING REMOVE THE TLD
        // remove the TLD from the left
        // skip this for localhost
        if (url_object.tld !== "localhost") url_object.left = url_object.left.replace(new RegExp("\." + url_object.tld + "$"), "");
        // (§) Get The Domains (Main Domain + Subdomains)
        var lleft = url_object.left;
        var not_allowed = /[^`~\!@\#\$%\^&\*\(\)_\=\+\[\]\{\}\\\|;\:'",<\>\/\?]/;
        var domains = [];
        var chars = lleft.split("");
        // loop in reverse
        for (var i = chars.length - 1; i > -1; i--) {
            var char = chars[i];
            if (not_allowed.test(char)) { // valid domain char
                // add to the domains array
                domains.push(char);
            } else break; // break the loop as an illegal char was hit
        }
        // reverse the array
        domains.reverse();
        var domain_string = domains.join("");
        // remove the domain string from the lleft
        lleft = lleft.replace(new RegExp(domain_string + "$"), "");
        url_object.left = lleft;
        domains = domain_string.split(".")
            .reverse();
        // no domain..set error
        if (!domains.length) return error(url_object, "no_domain");
        // loop over the domains
        for (var i = 0, l = domains.length; i < l; i++) {
            var domain = domains[i];
            var type = (i === 0) ? "domain" : "subdomain";
            // check that domain follows the domain name rules:
            // [https://www.domainit.com/support/faq.mhtml?category=Domain_FAQ&question=9]
            //
            // Regardless of the extension, all domain names must follow the same character rules...
            // You can use letters (abc), numbers (123) and dashes/hyphens (---).
            // Spaces are not allowed and the domain can't begin or end with a dash.
            //
            // A little known fact is that you CAN have multiple dashes right next to each other.
            // (e.g. domain--names.com) Opened up a few more possibilities?
            // check for illegal start/end slashes
            if ((/^\-|\-$/)
                .test(domain)) return error(url_object, "invalid_" + type);
            if (domain === "") {
                // if there is an empty domain like http://username:password@www.@subdomain.example.卷筒纸.com (@www.@domain)
                // this empty dot is an empty (sub)domain and an error is thrown
                return error(url_object, "empty_" + type);
            }
            // first domain is the main domain
            if (i === 0) {
                url_object.domain = domain;
                // add main domain to url_object
                url_object.mdomain = domain + (url_object.tld === "localhost" ? "" : ("." + url_object.tld));
                // add the domain to the front of the domains array via unshift
            } else url_object.subdomains.unshift(domain);
        }
        // stringify the domains
        url_object.subdomains = url_object.subdomains.join(".");
        // (§) Check For Authority
        var atsign_index = url_object.left.lastIndexOf("@");
        if (-~atsign_index) { // auth exists
            // the atsign must also be the last character in the left at this point
            if (atsign_index !== url_object.left.length - 1) error(url_object, "incorrectly_positioned_@");
            // remove the at sign
            url_object.left = url_object.left.replace(/@$/, "");
            // get the current left
            var lleft = url_object.left;
            // check for userinfo (username:password)
            // get the colon index
            var scheme_index = lleft.indexOf("://");
            var colon_index = lleft.indexOf(":", scheme_index + 1);
            // http://username:password@www.google.com/
            if (-~colon_index) {
                // get the username:password
                url_object.password = (lleft.substring(colon_index + 1, lleft.length) || null);
                // remove from the lleft
                lleft = lleft.substring(0, colon_index + 1);
                url_object.username = lleft.substring((-~scheme_index) ? (scheme_index + 3) : 0, colon_index) || null;
                // remove from the lleft
                lleft = lleft.substring(0, (-~scheme_index) ? (scheme_index + 3) : 0);
                // set the userinfo
                url_object.userinfo = (url_object.username || "") + ":" + (url_object.password || "");
            } else {
                // just check for a username
                // get the characters between the scheme and atsign
                url_object.username = lleft.substring((-~scheme_index) ? (scheme_index + 3) : 0, atsign_index) || null;
                // remove from the lleft
                lleft = lleft.substring(0, (-~scheme_index) ? (scheme_index + 3) : 0);
                // set the userinfo
                url_object.userinfo = (url_object.username || "");
            }
            // reset the left
            url_object.left = lleft;
        } // no auth...no action needed
        // (§) Get The Scheme scheme/protocol/left/punct.left
        // loop over schemes to check what matches
        var schemes = constants.schemes;
        var lleft = url_object.left;
        for (var i = 0, l = schemes.length; i < l; i++) {
            var scheme = schemes[i];
            var scheme_index = lleft.toLowerCase()
                .lastIndexOf(scheme);
            if (-~scheme_index) {
                // the following code checks for this case...
                // https://///////www.google.com/?gws_rd=ssl => passes
                // https:////chars/////www.google.com/?gws_rd=ssl => fails
                // get the remaining strings parts
                var before = lleft.substring(0, scheme_index);
                var after = lleft.substring(scheme_index + scheme.length, lleft.length);
                // reset...
                // reset the left
                lleft = before;
                url_object.left = before;
                if (after && after.replace(/\//g, "") !== "") {
                    // illegal chars detected...
                    return error(url_object, "illegal_chars_scheme");
                }
                // set the scheme/protocol
                url_object.scheme = scheme;
                url_object.protocol = scheme.replace("://", "");
                break;
            }
        }
        // left must be empty at this point...if not...
        // add the remains to the left punctuation
        if (url_object.left !== "") url_object.punct.left = lleft;
        // (§) Set The Hostname/Host/Origin
        // get subdomains
        var subdomains = url_object.subdomains,
            tld = url_object.tld;
        // if there are subdomains append a dot
        if (subdomains) subdomains += ".";
        // get needs parts...
        var subdomains_plus_domain = subdomains + url_object.domain;
        // if the TLD === localhost, use an empty string
        var tld_ = (tld !== "localhost" ? ("." + tld) : "");
        var port = (url_object.port ? (":" + url_object.port) : "");
        var scheme = (url_object.scheme || "");
        // set...
        url_object.hostname = subdomains_plus_domain + tld_;
        url_object.host = subdomains_plus_domain + tld_ + port;
        url_object.origin = scheme + subdomains_plus_domain + tld_ + port;
        // (§) Set The Authority
        // username:password@first.second.www.google.co.uk:9000
        url_object.authority = (url_object.userinfo ? url_object.userinfo + "@" : "") + (url_object.host || "");
        // (§) Set The Top Information
        // get TLD list from the global scope
        var top_domains = constants.top_domains,
            domain = url_object.domain;
        if (domain) {
            var tlds = top_domains[domain.toLowerCase()];
            if (tlds) {
                // set the top flags
                // the domain is in the top of websites
                url_object.top.domain = true;
                // the tld is also in the top of websites
                if (-~tlds.indexOf(url_object.tld)) url_object.top.mdomain = true;
            }
        }
    },
    /**
     * @description [Parses right of URL for port, query, parameters, & fragment.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "work_right": function(url_object) {
        // nothing to parse
        if (!url_object.right.length) return;
        // check if the first character is an illegal character
        // the starting char must be a colon (:) or a slash (/)
        if (!-~[":", "/"].indexOf(url_object.right.charAt(0))) {
            // end parsing the right side and set the right as punctuation
            url_object.punct.right = url_object.right;
            // reset...
            url_object.resource = null;
            return;
        }
        // (§) Extract Port If Present
        var port_matches = (url_object.right.match(/^\:(\d+)/) || []);
        if (port_matches.length) {
            // get the port
            var port = port_matches[0].replace(/\:/g, "");
            // set port
            url_object.port = (port || null);
            // remove port from right
            var right = url_object.right.replace(port_matches[0], "");
            url_object.right = right;
            // after the port there must be nothing or a forward slash
            if (!-~["", "/"].indexOf(url_object.right.charAt(0))) {
                // end parsing the right side and set the right as punctuation
                url_object.punct.right = right;
                // reset...
                url_object.resource = null;
                return;
            } else {
                // reset...
                if (right) url_object.resource = right;
                if (right) url_object.pathname = right;
            }
        }
        // scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
        // (§) Get Fragment
        var fragment_index = url_object.right.indexOf("#");
        if (-~fragment_index) { // has fragment
            // set fragment
            var hash = url_object.right.substring(fragment_index, url_object.right.length);
            url_object.fragment = hash.replace(/^#/, "");
            url_object.hash = hash;
            // remove fragment from right
            url_object.right = url_object.right.substring(0, fragment_index);
        }
        // (§) Get Query
        var query_index = url_object.right.indexOf("?");
        if (-~query_index) { // has query
            var query = url_object.right.substring(query_index, url_object.right.length)
                .replace(/^\?/, "");
            // set query
            url_object.query = "?" + query;
            // remove query from right
            url_object.right = url_object.right.substring(0, query_index);
            // parse query
            var parameters = query.split(/;|&/g);
            for (var i = 0, l = parameters.length; i < l; i++) {
                // cache parameter
                var parameter = parameters[i].split("=");
                // store parameter pair
                url_object.parameters[parameter[0]] = parameter[1];
            }
        }
        // (§) Get Filename
        // check if the last chars is an extension
        var path = url_object.right;
        if (path) {
            // split directory names into an array
            var directories = path.split("/");
            // get the last array item (it is the filename)
            var last = directories.pop();
            // there needs to be a filename
            if (last.split(".")
                .length >= 2) {
                // set the filename
                if (last) {
                    // CHECK FILENAME EXTENSION??
                    // check that the file extension is exists
                    // var parts = last.split(".");
                    // var extension = parts.pop();
                    // if (-~constants.extensions.indexOf(extension)) error(url_object, "invalid_filename_extension");
                    // set the filename and directories
                    url_object.filename = last;
                }
            } else {
                // add it back into the directories array
                directories.push(last);
            }
            // reset the directories
            directories = directories.join("/");
            if (directories === "") directories = "/";
            if (directories) url_object.directory = directories;
        }
        // (§) Reset Pathname
        url_object.pathname = url_object.right;
    },
    /**
     * @description [Remove any right side punctuation, it at all.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "punct_right": function(url_object) {
        // cache needed vars
        var fragment = url_object.hash,
            query = url_object.query,
            path = url_object.pathname;
        // determine the string
        var string,
            type;
        if (fragment) {
            string = fragment;
            type = "fragment";
        } else if (query) {
            string = query;
            type = "query";
        } else if (path) {
            string = path;
            type = "pathname";
        } else {
            // return as there is no string to work with
            return;
        }
        // first check
        // get the first character of the left punctuation
        var first_left = url_object.punct.left.charAt(0),
            match_type;
        if ((/[\(\[<]/)
            .test(first_left)) {
            match_type = ">";
            if (first_left === "(") match_type = ")";
            else if (first_left === "[") match_type = "]";
        }
        var counts = {
            "parens": 0,
            "braces": 0,
            "lg": 0
        };
        var indices = {
            "parens": [],
            "braces": [],
            "lg": []
        };
        var first;
        // loop over the string
        for (var i = 0, l = string.length; i < l; i++) {
            var char = string[i];
            if (char === "(") {
                counts.parens++;
                indices.parens.push([i, "("]);
            } else if (char === ")") {
                if (!first && counts.parens === 0) {
                    first = [i, ")"];
                }
                counts.parens--;
                indices.parens.push([i, ")"]);
            } else if (char === "[") {
                counts.braces++;
                indices.braces.push([i, "["]);
            } else if (char === "]") {
                if (!first && counts.braces === 0) {
                    first = [i, "]"];
                }
                counts.braces--;
                indices.braces.push([i, "]"]);
            } else if (char === "<") {
                counts.lg++;
                indices.lg.push([i, "<"]);
            } else if (char === ">") {
                if (!first && counts.lg === 0) {
                    first = [i, ">"];
                }
                counts.lg--;
                indices.lg.push([i, ">"]);
            }
        }
        // if there exists an wrap character reset the right/type(hash)
        // to everything before the wrap character
        if (first) {
            url_object.punct.right = string.substring(first[0], string.length);
            var hash = string.substring(0, first[0]);
            url_object[type] = hash.replace(/^#/, "");
            // if the type is set to the fragment the hash also needs to be reset
            if (type === "fragment") url_object.hash = hash;
        }
    },
    /**
     * @description [Performs any needed normalization post parse.]
     * @param  {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "normalize_end": function(url_object) {
        // [http://www.convertstring.com/EncodeDecode/HexEncode]
        // [https://perishablepress.com/stop-using-unsafe-characters-in-urls/]
        var unreserved_chars = {
            "%30": "0",
            "%31": "1",
            "%32": "2",
            "%33": "3",
            "%34": "4",
            "%35": "5",
            "%36": "6",
            "%37": "7",
            "%38": "8",
            "%39": "9",
            "%24": "$",
            "%7E": "~",
            "%2D": "-",
            "%5F": "_",
            "%2E": ".",
            "%2B": "+",
            "%21": "!",
            "%2A": "*",
            "%27": "'",
            "%28": "(",
            "%29": ")",
            "%2C": ",",
            "%61": "a",
            "%62": "b",
            "%63": "c",
            "%64": "d",
            "%65": "e",
            "%66": "f",
            "%67": "g",
            "%68": "h",
            "%69": "i",
            "%6A": "j",
            "%6B": "k",
            "%6C": "l",
            "%6D": "m",
            "%6E": "n",
            "%6F": "o",
            "%70": "p",
            "%71": "q",
            "%72": "r",
            "%73": "s",
            "%74": "t",
            "%75": "u",
            "%76": "v",
            "%77": "w",
            "%78": "x",
            "%79": "y",
            "%7A": "z",
            "%41": "A",
            "%42": "B",
            "%43": "C",
            "%44": "D",
            "%45": "E",
            "%46": "F",
            "%47": "G",
            "%48": "H",
            "%49": "I",
            "%4A": "J",
            "%4B": "K",
            "%4C": "L",
            "%4D": "M",
            "%4E": "N",
            "%4F": "O",
            "%50": "P",
            "%51": "Q",
            "%52": "R",
            "%53": "S",
            "%54": "T",
            "%55": "U",
            "%56": "V",
            "%57": "W",
            "%58": "X",
            "%59": "Y",
            "%5A": "Z"
        };
        /**
         * @description  [Object contains functions used alongside the string `replace`
         *                method. The functions are placed outside of the loop to stop
         *                JSLint from complaining.]
         * @type {Object}
         */
        var replace_unreserved_chars = function(match) {
            // check if it's in the unreserved chars list
            // replace with its character or simplt uppercase the match
            return (unreserved_chars[match]) ? unreserved_chars[match] : match.toUpperCase();
        };
        // if there is an empty domain like http://username:password@www.@subdomain.example.卷筒纸.com (@www.@domain)
        var parts = ["scheme", "userinfo", "hostname", "port", "pathname", "query", "hash"];
        var url = [];
        for (var i = 0, l = parts.length; i < l; i++) {
            var part_name = parts[i];
            var part = url_object[part_name];
            // skip loop iteration if the part is not set to something
            if (part === null) continue;
            // normalize
            if (-~["scheme", "hostname"].indexOf(part_name)) {
                // (§) Converting the scheme and host to lower case
                part = part.toLowerCase();
                // convert any ascii to unicode
                if (part_name === "hostname") {
                    part = part.split(".");
                    part = part.map(map.punycodeUnicode);
                    part = part.join(".");
                }
            } else if (part_name === "userinfo") {
                part += "@";
            } else if (part_name === "port") {
                // (§) Removing the default ports (http:80, https:443)
                part = ((-~["80", "443"].indexOf(part)) ? "" : (":" + part));
            } else if (-~["pathname", "query", "hash"].indexOf(part_name)) {
                // (§) Capitalizing letters in escape sequences
                // (§) Decoding percent-encoded octets of unreserved characters
                var pattern = /\%[a-f0-9]{2}/gi;
                part = part.replace(pattern, replace_unreserved_chars);
                // (§) Add the trailing slash (really needed???)
                if (part_name === "pathname") {
                    if (!url_object.filename && part_name !== "/") {
                        // (§) Remove double+ slashes
                        part = part.replace(/\/{2,}/g, "/");
                        // <==  (Is this really needed?) ==>
                        // // there is a pathname to add a slash to
                        // // the last character must not be a slash
                        // if (part.charAt(part.length - 1) !== "/") {
                        //     // add the trailing slash
                        //     part += "/";
                        // }
                        // <==  (Is this really needed?) ==>
                    }
                } else if (part_name === "query") {
                    // (§) Removing the "?" when the query is empty
                    part = ((part === "" || part === "?") ? "" : (part));
                    // part = ((part === "") ? "" : ("?" + part));
                } else if (part_name === "hash") {
                    // (§) Removing the "#" when the query is empty
                    part = ((part === "#") ? "" : part);
                }
            }
            url.push(part || "");
        }
        url_object.normalized = url.join("");
    },
    /**
     * @description [Builds the final url and adds it to the url_object.]
     * @param {Object} url_object [The url_object to work with.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "build_url": function(url_object) {
        // if there is an empty domain like http://username:password@www.@subdomain.example.卷筒纸.com (@www.@domain)
        var o = url_object;
        var parts = ["scheme", "userinfo", "hostname", "port", "pathname", "query", "hash"];
        var url = [];
        for (var i = 0, l = parts.length; i < l; i++) {
            var part = o[parts[i]];
            if (parts[i] === "userinfo" && part !== null) {
                part = part + "@";
            } else if (parts[i] === "port" && part) {
                part = ":" + part;
            } else if (parts[i] === "query" && part) {
                // remove the starting `?` from the query if present
                if ((/^\?/)
                    .test(part)) {
                    url_object.query = part.replace(/^\?/, "");
                }
            }
            url.push(part || "");
        }
        url_object.url = url.join("");
    },
    /**
     * @description [Empty function must be called as last step trigger final parsability check.]
     * @return {Undefined}   [Nothing is returned.]
     */
    "final_check": function() {}
};
/**
 * @description [The main app function. Invokes the parser function w/o errors.]
 * @param {String} string [The provided url.]
 * @param {Boolean} suppress_errors [Flag indicating whether parser errors should be suppressed.]
 * @return {Object}        [The url_object containing the URL parts.]
 */
function main(string, suppress_errors) {
    // don't hide errors
    if (!suppress_errors) {
        return parser(string);
    } else { // hide any error; just return the string
        try {
            return parser(string);
        } catch (e) {
            // create the url object
            var url = url_object(string);
            // just set the url to later access
            url.url = string;
            // set the error message
            error(url, "unidentified_error");
            // cleanup the url object before returning
            cleanup(url);
            // return the url object
            return url;
        }
    }
}
/**
 * @description [Parse the possible URL string into its anatomic parts.]
 * @param  {String} string [The string to parse.]
 * @return {Object}        [On object containing the URLs parts and any other information.]
 */
function parser(string) {
    // setup url_object
    var url = url_object(string);
    var algorithm = ["is_empty", "min_length", "illegal_chars", "parser_determination", "normalize_start", "get_tlds", "validate_tld", "split_url", "work_left", "work_right", "punct_right", "build_url", "normalize_end", "final_check"];
    // loop through all parsing steps
    for (var i = 0, l = algorithm.length; i < l; i++) {
        // if URL is invalid stop function execution
        if (url.error || url.skip) break;
        steps[algorithm[i]](url);
    }
    // finally, cleanup
    cleanup(url);
    return url;
}
