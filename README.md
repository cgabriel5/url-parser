# url-parser

An experimental JavaScript URL parser.

##### Table of Contents

[What It Does](#what-it-does)  
[What It Does Not Do](#what-it-does-not-do)  
[Access Parser](#access-parser)  
[Examples](#examples)  
[License](#license)  

<a name="what-it-does"></a>
### What It Does

Parses a properly formated URL string to extract its scheme, authority (username & password), subdomains, domain, tld, hostname, port, path, query (parameters), and fragment.

<a name="what-it-does-not-do"></a>
### What It Does Not Do

Does not parse URLs in the form of an IP address.

<a name="access-parser"></a>
### Access Parser

```js
var parse_URL = window.parse_url;
// or
var parse_URL = parse_url;
```

<a name="examples"></a>
### Examples

```js
parse_URL("https://www.youtube.com/watch?v=Gj2nOk8af-o");
// output
{
    "error": false,
    "auth": null,
    "top": true,
    "url": "https://www.youtube.com/watch?v=Gj2nOk8af-o",
    "scheme": "https",
    "username": null,
    "password": null,
    "subdomains": ["www"],
    "domain": "youtube",
    "mdomain": "youtube.com",
    "tld": "com",
    "hostname": "www.youtube.com",
    "port": null,
    "path": "/watch",
    "query": "?v=Gj2nOk8af-o",
    "parameters": {"v":"Gj2nOk8af-o"},
    "fragment":null
}

parse_URL("https://youtu.be/1xo3af_6_Jk");
// output
{
    "error": false,
    "auth": null,
    "top": false,
    "url":"https://youtu.be/1xo3af_6_Jk"
    ,"scheme": "https",
    "username": null,
    "password": null,
    "subdomains": [],
    "domain": "youtu",
    "mdomain": "youtu.be",
    "tld": "be",
    "hostname": "youtu.be",
    "port": null,
    "path": "/1xo3af_6_Jk",
    "query": null,
    "parameters": {},
    "fragment":null
}

parse_URL("https://www.google.com/");
// output
{
    "error": false,
    "auth": null,
    "top": true,
    "url": "https://www.google.com/",
    "scheme": "https",
    "username": null,
    "password": null,
    "subdomains": ["www"],
    "domain": "google",
    "mdomain": "google.com",
    "tld": "com",
    "hostname": "www.google.com",
    "port": null,
    "path": "/",
    "query": null,
    "parameters": {},
    "fragment":null
}

parse_URL("https://google.com/");
// output
{
    "error":  false,
    "auth":  null,
    "top":  true,
    "url":  "https://google.com/",
    "scheme":  "https",
    "username":  null,
    "password":  null,
    "subdomains":  [],
    "domain":  "google",
    "mdomain":  "google.com",
    "tld":  "com",
    "hostname":  "google.com",
    "port":  null,
    "path":  "/",
    "query":  null,
    "parameters":  {},
    "fragment":null
}

parse_URL("google.com");
// output
{
    "error":  false,
    "auth":  null,
    "top":  false,
    "url":  "google.com",
    "scheme":  null,
    "username":  null,
    "password":  null,
    "subdomains":  [],
    "domain":  "google",
    "mdomain":  "google.com",
    "tld":  "com",
    "hostname":  "google.com",
    "port":  null,
    "path":  "",
    "query":  null,
    "parameters":  {},
    "fragment":null
}
```

<a name="license"></a>
### License

This project uses the [MIT License](https://github.com/cgabriel5/url-parser/blob/master/LICENSE.txt).