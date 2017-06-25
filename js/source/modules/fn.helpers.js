/**
 * @description [Removes unneeded porperties from url_object and resets URL property to originally provided url.]
 * @param {Object} url_object [The url_object to work with.]
 * @return {Undefined}   [Nothing is returned.]
 */
function cleanup(url_object) {
    // names of keys to remove
    var keys = ["length", "tld_index_start", "tld_index_end", "tld_matches", "cleaned_tld", "left", "right", "tslash", "skip"];
    for (var i = 0, l = keys.length; i < l; i++) delete url_object[keys[i]];
}
/**
 * @description [Create error message and adds it to url_object.]
 * @param {Object} url_object   [The url_object to work with.]
 * @param {String} message_name [The message name.]
 */
function error(url_object, message_name) {
    // update url_object
    url_object.error = {
        "name": message_name,
        "human": errors[message_name]
    };
}
/**
 * @description [Makes a new url_object.]
 * @param {String} url [The provided URL string to parse.]
 * @return {Object}     [The newly made url_object.]
 */
function url_object(url) {
    return {
        // =============== miscellaneous
        "source": url, // original string
        "error": null, // possible parsing error
        "top": {
            // does the main domain contain a top
            // 10,000 main domain name
            "mdomain": false,
            // is the URLs domain name a top 10,000
            // domain name
            "domain": false,
        },
        "punct": { // any left/right bound punctuation
            "left": "",
            "right": ""
        },
        "mdomain": null, // domain + tld
        // =============== URL Format
        //  scheme:[//[user:password@]host[:port]][/]path[?query][#fragment]
        // =============== [PARTS START]
        "scheme": null,
        "protocol": null, // without the ://
        // ===============
        "userinfo": null,
        "username": null,
        "password": null,
        // ===============
        "subdomains": [],
        "domain": null,
        "tld": null,
        // ===============
        "port": null,
        // ===============
        "pathname": null,
        // ===============
        "query": null,
        "parameters": {},
        // ===============
        "fragment": null,
        "hash": null, // with the starting # sign
        // ===============
        "authority": null,
        // =============== [PARTS END]
        "url": url, // Final parsed URL
        "normalized": url, // Normalized URL
        // =============== File Info
        "directory": null,
        "filename": null,
        // =============== Formats
        "hostname": null, // subdomains + domain + tld
        "host": null, // subdomains + domain + tld + port
        // ===============
        "origin": null, // left (scheme to port)
        "resource": null, // right (path to URL End)
        // ===============
        "skip": null, // used for data: urls
        // data: format object;
        "data": {
            "mediatype": null,
            "type": null,
            "subtype": null,
            "parameters": null,
            "data": null,
            "base64": false,
            "scheme": "data:",
            "protocol": "data"
        }
    };
}
