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

        // small URL test
        var urls = [
            "https://enochs.mcs4kids.com/",
            "https://www.google.co.uk/?gws_rd=ssl#q=youtube",
            "https://data.gov.uk/",
            "https://www.gov.uk/",
            "https://google.com/",
            "@google.com:9090/",
            "http://xn--fsqu00a.xn--3lr804guic/",
            "http://例子.卷筒纸",
            "https://support.microsoft.com/en-us/kb/909264",
            "https://www.google.com/search?biw=1920&bih=990&q=allowed+characters+in+server+username&oq=allowed+characters+in+server+username&gs_l=serp.3...6622.7071.0.7972.4.4.0.0.0.0.115.367.3j1.4.0....0...1c.1.64.serp..0.1.84...33i21k1.bwu3EftBYdY#the-fragment",
            "https://www.google.com/search?q=hillary+clinton&oq=hillary+clinton;aqs=chrome..69i57j69i61l3.3328j0j4;sourceid=chrome;ie=UTF-8",
            "https://publicsuffix.org/list/public_suffix_list.dat?t=",
            "http://example.com/index.html#:words:some-context-for-a-(search-term)",
            "http://serverfault.com:443/questions/371907/can-you-pass-user-pass-for-http-basic-authentication-in-url-parameters",
            "drive.google.co.uk:9090/",
            "https://gma.yahoo.com/government-steps-judge-denies-tribes-request-stop-pipeline-211215145--abc-news-topstories.html",
            ".com:9090/",
            "facebook.com:7070/",
            "http://@www.subdomain.2-twitch.com.ac:8080/引き割り.html",
            ">https://www.google.com",
            "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dcomputers&field-keywords=hdmi+splitter",
            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec",
            "https://www./s/ref=nb_sb_noss_2?url=search-alias%3Dcomputers&field-keywords=hdmi+splitter",
            // // ------------------
            "http://localhost/projects/url-parser/parser/index.html",
            "http://something:password@www.subdomain.google.com/",
            "something:password@www.subdomain.google.com/",
            "http://sub.localhost/projects/url-parser/parser/index.html",
            "sub.localhost/projects/url-parser/parser/index.html",
            "localhost/projects/url-parser/parser/index.html",
            "www.localhost/projects/url-parser/parser/index.html",
            "http://www.google.com",
            "http://google.com",
            "www.google.com",
            "www.google",
            "google.com",
            "www.localhost"
        ];

        // loop over test URLs
        for (var i = 0, l = urls.length; i < l; i++) {
            // cache test + suppress errors
            var test = parseURL(urls[i], true);
            // log test information (test status, test url, test error)
            console.log((!test.error ? "✔" : "✘"), test.url, (test.error ? test.error : true));
        }

    }

};
