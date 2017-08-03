# url-parser

An experimental JavaScript URL parser.

##### Table of Contents

- [Project Setup](#project-setup)
- [What It Does](#what-it-does)
- [What It Does Not Do](#what-it-does-not-do)
- [Add To Project](#add-to-project)
- [API](#api)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

<a name="what-it-does"></a>
### What It Does

Parses a properly formated URL string to extract its scheme, authority (username & password), subdomains, domain, tld, hostname, port, path, query (parameters), and fragment.

<a name="what-it-does-not-do"></a>
### What It Does Not Do

Does not parse URLs in the form of an IP address.

<a name="project-setup"></a>
### Project Setup

Project uses [this](https://github.com/cgabriel5/snippets/tree/master/boilerplate/application) boilerplate. Its [README.md](https://github.com/cgabriel5/snippets/blob/master/boilerplate/application/README.md#-read-before-use) contains instructions for `Yarn` and `Gulp`.

<a name="add-to-project"></a>
### Add To Project

**Note**: The library, both minimized and unminimized, is located in `lib/`.

```html
<script src="path/to/lib.js"></script>
<script>
document.onreadystatechange = function() {
    "use strict";
    // once all resources have loaded
    if (document.readyState == "complete") {
        // get the library
        var parseURL = window.app.libs.parseURL;
        // logic...
    }
});
</script>
```

<a name="api"></a>
### API

- [➜ parseURL()](#main-function)

<a name="main-function"></a>
➜ **parseURL(`url`)** &mdash; Parse provided URL string into its respective components.

- `url` (`String`, _Required_)
    - The properly _formatted_ URL string to parse.
- **Returns** object with the URL's components.
    - Object Properties:
        - `source` (`String`) The source string (provided URL string).
        - `error` (`Object|Null`) Object containing possible parsing error. Null for no errors.
            - `name` (`String`) The name of the parse error.
            - `human` (`String`) Human explanation for parsing error. 
        - `top` (`Object`) Object containing information whether the URL has a top domain.
            - `mdomain` (`Boolean`) Indicates whether the main domain is in the top 10,000 sites.
            - `domain` (`Boolean`) Indicates whether the domain is in the top 10,000 sites.
            - **Note**: Domain is compared against Alexa website data.
        - `punct` (`Object`, _Experimental_) 
            - `left` (`String`) Any detected left side punctuation removed from URL string.
            - `right` (`String`) Any detected right side punctuation removed from URL string.
        - `mdomain` (`String|Null`) The URLs main domain (domain + tld).
        - `scheme` (`String|Null`) The URLs scheme.
        - `protocol` (`String|Null`) The URLs scheme without the `://`.
        - `userinfo` (`String|Null`) The URLs userinfo.
        - `username` (`String|Null`) The URLs username.
        - `password` (`String|Null`) The URLs password.
        - `subdomains` (`Array`) Array containing extracted subdomains.
        - `domain` (`String|Null`) The URLs domain.
        - `tld` (`String|Null`) The URLs top-level domain.
        - `port` (`Number|Null`) The URLs used port.
        - `pathname` (`String|Null`) The URLs pathname.
        - `query` (`String|Null`) The URLs query.
        - `parameters` (`Object`) Object containing the query parameters.
        - `fragment` (`String|Null`) The URLs fragment.
        - `hash` (`String|Null`) The URLs hash.
        - `authority` (`String|Null`) The URLs authority (username + password + subdomains + domain + tld + port).
        - `url` (`String`) The final, clean URL with any left/right punctuation removed.
        - `normalized` (`String`) The final URL but normalized.
        - `directory` (`String|Null`) The URLs directory.
        - `filename` (`String|Null`) The URLs filename.
        - `hostname` (`String|Null`) The URLs hostname (subdomains + domain + tld).
        - `host` (`String|Null`) The URLs host (subdomains + domain + tld + port).
        - `origin` (`String|Null`) The URLs origin (everything from the scheme to port).
        - `resource` (`String|Null`) The URLs resource (everything from the path to the end of the URL).
        - `data` (`Object`) When the URL is a base64 URL this object will contain its information.
            - `mediatype` (`String|Null`) The URLs mediatype.
            - `type` (`String|Null`) The URLs type.
            - `subtype` (`String|Null`) The URLs subtype.
            - `parameters` (`String|Null`) The URLs parameters.
            - `data` (`String|Null`) The URLs data.
            - `base64` (`Boolean`) Indicates whether the URL is a base64 URL.
            - `scheme` (`String`) Will always be `"data:"`.
            - `protocol` (`String`) Will always be `"data"`.

<a name="usage"></a>
### Usage

For an exhaustive list of tested URLs see `js/source/test.js`. Run `index.html` and open up the console. URLs that fail the parser will be found at the very bottom of the webpage.

```js
parseURL("https://www.youtube.com/watch?v=Gj2nOk8af-o");
// output
{
    "source": "https://www.youtube.com/watch?v=Gj2nOk8af-o",
    "error": null,
    "top": {
        "mdomain": true,
        "domain": true
    },
    "punct": {
        "left": "",
        "right": ""
    },
    "mdomain": "youtube.com",
    "scheme": "https://",
    "protocol": "https",
    "userinfo": null,
    "username": null,
    "password": null,
    "subdomains": "www",
    "domain": "youtube",
    "tld": "com",
    "port": null,
    "pathname": "/watch",
    "query": "v=Gj2nOk8af-o",
    "parameters": {
        "v": "Gj2nOk8af-o"
    },
    "fragment": null,
    "hash": null,
    "authority": "www.youtube.com",
    "url": "https://www.youtube.com/watch?v=Gj2nOk8af-o",
    "normalized": "https://www.youtube.com/watchv=Gj2nOk8af-o",
    "directory": "/watch",
    "filename": null,
    "hostname": "www.youtube.com",
    "host": "www.youtube.com",
    "origin": "https://www.youtube.com",
    "resource": "/watch?v=Gj2nOk8af-o",
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
}

parseURL("https://youtu.be/1xo3af_6_Jk");
// output
{
    "source": "https://youtu.be/1xo3af_6_Jk",
    "error": null,
    "top": {
        "mdomain": false,
        "domain": false
    },
    "punct": {
        "left": "",
        "right": ""
    },
    "mdomain": "youtu.be",
    "scheme": "https://",
    "protocol": "https",
    "userinfo": null,
    "username": null,
    "password": null,
    "subdomains": "",
    "domain": "youtu",
    "tld": "be",
    "port": null,
    "pathname": "/1xo3af_6_Jk",
    "query": null,
    "parameters": {},
    "fragment": null,
    "hash": null,
    "authority": "youtu.be",
    "url": "https://youtu.be/1xo3af_6_Jk",
    "normalized": "https://youtu.be/1xo3af_6_Jk",
    "directory": "/1xo3af_6_Jk",
    "filename": null,
    "hostname": "youtu.be",
    "host": "youtu.be",
    "origin": "https://youtu.be",
    "resource": "/1xo3af_6_Jk",
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
}

parseURL("https://www.google.com/");
// output
{
    "source": "https://www.google.com/",
    "error": null,
    "top": {
        "mdomain": true,
        "domain": true
    },
    "punct": {
        "left": "",
        "right": ""
    },
    "mdomain": "google.com",
    "scheme": "https://",
    "protocol": "https",
    "userinfo": null,
    "username": null,
    "password": null,
    "subdomains": "www",
    "domain": "google",
    "tld": "com",
    "port": null,
    "pathname": "/",
    "query": null,
    "parameters": {},
    "fragment": null,
    "hash": null,
    "authority": "www.google.com",
    "url": "https://www.google.com/",
    "normalized": "https://www.google.com/",
    "directory": "/",
    "filename": null,
    "hostname": "www.google.com",
    "host": "www.google.com",
    "origin": "https://www.google.com",
    "resource": "/",
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
}

parseURL("https://google.com/");
// output
{
    "source": "https://google.com/",
    "error": null,
    "top": {
        "mdomain": true,
        "domain": true
    },
    "punct": {
        "left": "",
        "right": ""
    },
    "mdomain": "google.com",
    "scheme": "https://",
    "protocol": "https",
    "userinfo": null,
    "username": null,
    "password": null,
    "subdomains": "",
    "domain": "google",
    "tld": "com",
    "port": null,
    "pathname": "/",
    "query": null,
    "parameters": {},
    "fragment": null,
    "hash": null,
    "authority": "google.com",
    "url": "https://google.com/",
    "normalized": "https://google.com/",
    "directory": "/",
    "filename": null,
    "hostname": "google.com",
    "host": "google.com",
    "origin": "https://google.com",
    "resource": "/",
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
}

parseURL("google.com");
// output
{
    "source": "google.com",
    "error": null,
    "top": {
        "mdomain": true,
        "domain": true
    },
    "punct": {
        "left": "",
        "right": ""
    },
    "mdomain": "google.com",
    "scheme": null,
    "protocol": null,
    "userinfo": null,
    "username": null,
    "password": null,
    "subdomains": "",
    "domain": "google",
    "tld": "com",
    "port": null,
    "pathname": null,
    "query": null,
    "parameters": {},
    "fragment": null,
    "hash": null,
    "authority": "google.com",
    "url": "google.com",
    "normalized": "google.com",
    "directory": null,
    "filename": null,
    "hostname": "google.com",
    "host": "google.com",
    "origin": "google.com",
    "resource": "",
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
}
```

<a name="contributing"></a>
### Contributing

Contributions are welcome! Found a bug, feel like documentation is lacking/confusing and needs an update, have performance/feature suggestions or simply found a typo? Let me know! :)

See how to contribute [here](https://github.com/cgabriel5/url-parser/blob/master/CONTRIBUTING.md).

<a name="license"></a>
### License

This project uses the [MIT License](https://github.com/cgabriel5/url-parser/blob/master/LICENSE.txt).