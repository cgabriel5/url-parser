# url-parser

An experimental JavaScript URL parser.

##### Table of Contents

[What It Does](#what-it-does)  
[What It Does Not Do](#what-it-does-not-do)  
[Add To Project](#add-to-project)  
[Access Library](#access-library)  
[API](#api)  
* [Signature](#signature-api)    

[Usage](#usage)  
[Contributing](#contributing)  
[License](#license)  

<a name="what-it-does"></a>
### What It Does

Parses a properly formated URL string to extract its scheme, authority (username & password), subdomains, domain, tld, hostname, port, path, query (parameters), and fragment.

<a name="what-it-does-not-do"></a>
### What It Does Not Do

Does not parse URLs in the form of an IP address.

<a name="add-to-project"></a>
### Add To Project

```html
<script src="path/to/lib.js"></script>
```

<a name="access-library"></a>
### Access Library

```js
var parseURL = window.app.libs.parseURL;
```

<a name="api"></a>
### API

<a name="signature-api"></a>
### API &mdash; Signature

```js
/**
 * @param  {String: Required} [The properly formatted URL string to parse.]
 * @return {Object}           [Object containing the parsed URL's components.]
 */
```

<a name="usage"></a>
### Usage

For an exhaustive list of tested URLs see `js/source/app.js`. Run `index.html` and open up the console.

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