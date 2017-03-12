document.onreadystatechange = function() {

    "use strict";

    /* [functions.utils] */

    if (document.readyState == "complete") {

        var test,
            // get the library
            parseURL = window.app.libs.parseURL;

        test = parseURL("https://www.youtube.com/watch?v=Gj2nOk8af-o");
        console.log(test);
        // output
        // {
        //     "error": false,
        //     "auth": null,
        //     "top": true,
        //     "url": "https://www.youtube.com/watch?v=Gj2nOk8af-o",
        //     "scheme": "https",
        //     "username": null,
        //     "password": null,
        //     "subdomains": ["www"],
        //     "domain": "youtube",
        //     "mdomain": "youtube.com",
        //     "tld": "com",
        //     "hostname": "www.youtube.com",
        //     "port": null,
        //     "path": "/watch",
        //     "query": "?v=Gj2nOk8af-o",
        //     "parameters": {"v":"Gj2nOk8af-o"},
        //     "fragment":null
        // }

        test = parseURL("https://youtu.be/1xo3af_6_Jk");
        console.log(test);
        // output
        // {
        //     "error": false,
        //     "auth": null,
        //     "top": false,
        //     "url":"https://youtu.be/1xo3af_6_Jk",
        //     "scheme": "https",
        //     "username": null,
        //     "password": null,
        //     "subdomains": [],
        //     "domain": "youtu",
        //     "mdomain": "youtu.be",
        //     "tld": "be",
        //     "hostname": "youtu.be",
        //     "port": null,
        //     "path": "/1xo3af_6_Jk",
        //     "query": null,
        //     "parameters": {},
        //     "fragment":null
        // }

        test = parseURL("https://www.google.com/");
        console.log(test);
        // output
        // {
        //     "error": false,
        //     "auth": null,
        //     "top": true,
        //     "url": "https://www.google.com/",
        //     "scheme": "https",
        //     "username": null,
        //     "password": null,
        //     "subdomains": ["www"],
        //     "domain": "google",
        //     "mdomain": "google.com",
        //     "tld": "com",
        //     "hostname": "www.google.com",
        //     "port": null,
        //     "path": "/",
        //     "query": null,
        //     "parameters": {},
        //     "fragment":null
        // }

        test = parseURL("https://google.com/");
        console.log(test);
        // output
        // {
        //     "error": false,
        //     "auth": null,
        //     "top": true,
        //     "url": "https://google.com/",
        //     "scheme": "https",
        //     "username": null,
        //     "password": null,
        //     "subdomains": [],
        //     "domain": "google",
        //     "mdomain": "google.com",
        //     "tld": "com",
        //     "hostname": "google.com",
        //     "port": null,
        //     "path": "/",
        //     "query": null,
        //     "parameters": {},
        //     "fragment":null
        // }

        test = parseURL("google.com");
        console.log(test);
        // output
        // {
        //     "error": false,
        //     "auth": null,
        //     "top": false,
        //     "url": "google.com",
        //     "scheme": null,
        //     "username": null,
        //     "password": null,
        //     "subdomains": [],
        //     "domain": "google",
        //     "mdomain": "google.com",
        //     "tld": "com",
        //     "hostname": "google.com",
        //     "port": null,
        //     "path": "",
        //     "query": null,
        //     "parameters": {},
        //     "fragment":null
        // }

    }

};
