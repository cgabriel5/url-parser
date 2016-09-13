# url_parser
An experimental JavaScript URL parser.

### What it does?
Parses a properly formated URL string to extract its scheme, authority (username & password), subdomains, domain, tld, hostname, port, path, query (parameters), and fragment.

### What it does not do.
Does not parse URLs in the form of an IP address.

### Access Parser
```js
var url_parse = window.parse_url;
```

### Examples
```js
parse_url("https://google.com/");
parse_url("google.com");
```

### Whats next?
Alongside parsing, I would like to validate the URL based on its format.
For example, this should fail validity test:
```js
parse_url("https://.com/"); // invalid, missing domain name
```
