document.onreadystatechange = function() {

    "use strict";

    if (document.readyState == "complete") {

        // get the library
        var parseURL = window.app.libs.parseURL;

        // random test strings
        var pool = [

            // some urls were gotten from [https://mathiasbynens.be/demo/url-regex], wikipedia, random sites, localhost server,
            // and any url that seemed good enough to test. Feel free to add/remove any url to the pool.

            // common syntax urls
            "https://www.youtube.com/watch?v=Gj2nOk8af-o",
            "https://youtu.be/1xo3af_6_Jk",
            "https://enochs.mcs4kids.com/",
            "https://www.google.co.uk/?gws_rd=ssl#q=youtube",
            "https://google.com/",
            "https://www.google.com/",
            "@google.com:9090/",
            "google.com:9090/",
            "https://www.kohls.com/checkout/v2/order_confirm.jsp",
            "https://www.twitch.tv/videos/130264598",
            "http://cart.half.ebay.com/ws/eBayISAPI.dll?HalfAddItemToCart&ap=view&_trksid=",
            "https://www.google.com/search?q=hillary+clinton&oq=hillary+clinton;aqs=chrome..69i57j69i61l3.3328j0j4;sourceid=chrome;ie=UTF-8",
            "https://publicsuffix.org/list/public_suffix_list.dat?t=",
            "http://serverfault.com:443/questions/371907/can-you-pass-user-pass-for-http-basic-authentication-in-url-parameters",
            "drive.google.co.uk:9090/",
            "https://gma.yahoo.com/government-steps-judge-denies-tribes-request-stop-pipeline-211215145--abc-news-topstories.html",
            "facebook.com:7070/",
            "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dcomputers&field-keywords=hdmi+splitter",
            "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec",
            "https://support.microsoft.com/en-us/kb/909264",
            "https://www.google.com/search?biw=1920&bih=990&q=allowed+characters+in+server+username&oq=allowed+characters+in+server+username&gs_l=serp.3...6622.7071.0.7972.4.4.0.0.0.0.115.367.3j1.4.0....0...1c.1.64.serp..0.1.84...33i21k1.bwu3EftBYdY#the-fragment",
            "https://redd.it/4lme36",
            "https://www.reddit.com/r/Spanish/comments/4lme36/best_showsmovies_in_spanish_on_netflix/",
            "youtube.com/watch?v=pS-gbqbVd8c",
            "en.c.org/a_(b)",
            "http://example.com/foo.mp4#t=10,20",
            "http://example.com/bar.webm#t=40,80&xywh=160,120,320,240",
            "http://example.com/page?query#!state",
            "http://example.com/index.html#115Fragm8+-52f89c4c",
            "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1490330089&rver=6.7.6640.0&wp=MBI_SSL&wreply=https%3a%2f%2foutlook.live.com%2fowa%2f%3fauthRedirect%3dtrue%26realm%3doutlook.com&id=292841&whr=outlook.com&CBCXT=out&fl=wld&cobrandid=90015",
            "https://www.bing.com/search?q=Define%20architecture&raid=quiz&rnoreward=1&FORM=ML12JG&rqw=1&skipopalnative=true&rqpiodemo=1&roid=10XMSRewards_MSR_ThursdayBonusQuiz_20170323",
            "https://account.microsoft.com/rewards/dashboard?refd=www.bing.com",
            "https://www.bing.com/search?form=ML12JG&q=Define%20fanlight&rqar=1&rqor=1&rnoreward=1&skipopalnative=true",
            "http://www.bing.com/search?q=Tesla+Model+3+safety&filters=tnTID%3a%22EF36602C-DDF8-43fa-BA96-49B079C43980%22+tnVersion%3a%221871856%22+segment%3a%22popularnow.carousel%22+tnCol%3a%221%22+tnOrder%3a%228335105e-9f78-4b6d-94e1-60c9906ecaf3%22&FORM=HPNN01",
            "http://www.bing.com/search?q=Tesla+Model+3+safety&filters=tnTID%3a\"EF36602C-DDF8-43fa-BA96-49B079C43980\"+tnVersion%3a\"1871856\"+segment%3a\"popularnow.carousel\"+tnCol%3a\"1\"+tnOrder%3a\"8335105e-9f78-4b6d-94e1-60c9906ecaf3\"&FORM=HPNN01",
            "http://www.super.duper.domain.co.uk",
            "http://www.super.duper.domain.co.uk:9000",
            "https://username:password@first.second.www.google.co.uk:9000/?gws_rd=ssl#q=youtube",
            "http://www.contoso.com:8080/",
            "http://www.soundclick.com/bands/default.cfm?bandID=1114479",
            "https://en.wikipedia.org/wiki/Fragment_identifier",
            "https://data.gov.uk/",
            "https://www.gov.uk/",
            "https://www.kpbsd.k12.ak.us/",
            "pvt.k12.wy.us",
            "pvt.us",
            "test.us",
            "www.test.us",
            "test.ak.us",
            "www.test.ak.us",
            "test.k12.ak.us",
            "www.test.k12.ak.us",
            "https://www.youtube.com/watch?v=9K_1e1my6G8",
            "http://foo:bar@w1.superman.com/very/long/path.html?p1=v1&p2=v2&p3=v3#more-details",
            "http://foo:bar@w1.superman.com/very/long/path.html?p1=v1;p2=v2;p3=v3#more-details",
            "https://secured.com:443",
            "http://example.com/index.html#:words:some-context-for-a-(search-term)",
            "http://foo.com/blah_blah",
            "http://foo.com/blah_blah/",
            "http://foo.com/blah_blah_(wikipedia)",
            "http://foo.com/blah_blah_(wikipedia)_(again)",
            "http://www.example.com/wpstyle/?p=364",
            "https://www.example.com/foo/?bar=baz&inga=42&quux",
            "http://userid:password@example.com:8080",
            "http://userid:password@example.com:8080/",
            "http://userid@example.com",
            "http://userid@example.com/",
            "http://userid@example.com:8080",
            "http://userid@example.com:8080/",
            "http://userid:password@example.com",
            "http://userid:password@example.com/",
            "http://foo.com/blah_(wikipedia)#cite-1",
            "http://foo.com/blah_(wikipedia)_blah#cite-1",
            "http://foo.com/(something)?after=parens",
            "http://code.google.com/events/#&product=browser",
            "http://j.mp",
            "http://taztaylorbeats.com/",
            "http://foo.bar/?q=Test%20URL-encoded%20stuff",
            "ahttp://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
            "-.~_!$&'()*+,;=:%40:80%2f::::::@example.com",
            "http://1337.net",
            "http://a.b-c.de",
            "https://gfycat.com/AcclaimedSparklingAmberpenshell",
            "http://server.com:80//path/info",
            "http://blog.sergeys.us/beer?utm_source=feedburner&amp;utm_medium=feed&amp;utm_campaign=Feed:+SergeySus+(Sergey+Sus+Photography+%C2%BB+Blog)&amp;utm_content=Google+Reader",
            "http://www.example.com/a%c2%b1b",
            "http://www.example.com/%7Eusername/",
            "http://www.example.com:80/bar.html",
            "https://www.example.com:443/bar.html",
            "https://www.example.com:443/",
            "https://www.example.com:443",
            "http://www.example.com/alice",
            "http://www.example.com/display?",
            "http://www.example.com/display/index.html#",
            "https://regex101.com/library/xJ5zC5",
            "http://apne.ws/1nRjKS0",
            "http://bit.ly/9H0CQT",
            "http://twitter.com/BBCTimWillcox",
            "http://www.bbc.co.uk/news/magazine-18529371",
            "http://bbc.in/Mb1PWM",
            "http://bbc.in/PCXSFT",
            "http://nbcnews.to/ReH3pK",
            "http://www.breakingnews.com/topic/75-earthquake-off-alaska-january-2013",
            "http://online.wsj.com/news/articles/SB10001424052702304908304579568590603893",
            "http://on.cnn.com/13DsWkq",
            "http://cnnmon.ie/1GZiy8l",
            "http://reut.rs/1sOV13M",
            "http://on.fb.me/i1i3sT",
            "http://econ.st/fcUlsA",
            "http://on.wsj.com/SIji5s",
            "http://on.wsj.com/1J4Id3r",
            "https://word.office.live.com/wv/WordView.aspx?FBsrc=https%3A%2F%2Fwww.facebook.com%2Fattachments%2Ffile_preview.php%3Fid%3D713981818737203%26time%3D1453372782%26metadata&access_token=1604966176%3AAVKzw1ZzsEjWvtPbeu8TWvHPb3URXSaCRCdnoJsfz5TVnQ&title=2016+Stage+ILE+Simulation+d_un+syste_me+d_armes+sous+Simulink.doc",
            "https://www.facebook.com/groups/522095331140491/?multi_permalinks=1255982751085075&ref=notif&notif_t=group_highlights",
            "https:///////////////////////////////////////////www.google.com////////////////?gws_rd=ssl",
            "http://alexcorvi.github.io/anchorme.js/#installation",
            "http://www.freeformatter.com/url-parser-query-string-splitter.html",
            "https://www.browserling.com/tools/url-parse",
            "http://example.com/引き割り.html",
            "http://example.com/%E5%BC%95%E3%81%8D%E5%89%B2%E3%82%8A.html",
            "https://en.wikipedia.org/wiki/URL",
            "https://en.wikipedia.org/wiki/URL_normalization",
            "https://en.wikipedia.org/wiki/Internationalized_domain_name",
            "https://en.wikipedia.org/wiki/File_URI_scheme",
            "https://superuser.com/questions/352133/why-do-file-urls-start-with-3-slashes",
            "http://stackoverflow.com/questions/20523318/is-a-url-with-in-the-path-section-valid",
            "https://perishablepress.com/stop-using-unsafe-characters-in-urls/",
            "http://example.com/wp-admin/load-scripts.php?c=1&load[]=swfobject,jquery,utils&ver=3.5",
            "http://test.site/wp-admin/post.php?t=1347548645469?t=1347548651124?t=1347548656685?t=1347548662469?t=1347548672300?t=1347548681615?",
            "https://twitter.com/CJTerry/status/848599701683359746?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Etweet",
            "http://www.test.com/dir/filename.jpg?var1=foo#bar",
            "http://www.domain--names.com/",
            "https://mathiasbynens.be/demo/url-regex",
            "http://php.net/manual/en/reference.pcre.pattern.modifiers.php",
            "a.b.example.uk.com",
            "example.uk.com",
            "http://www.google.com",
            "http://google.com",
            "http://something:password@www.subdomain.google.com/",
            "something:password@www.subdomain.google.com/",
            "www.google",
            "google.com",
            "www.google.com",
            "www.google.com:8000",
            "www.google.com/?key=value",
            "github.io",
            "https://www.bing.com/fd/ls/l?IG=24FC99C70ECA42DF845585210A0953FC&Type=Event.PPT&DATA={%22S%22:517,%22E%22:999,%22T%22:0,%22I%22:0,%22N%22:{},%22M%22:{}}&P=SERP&DA=CO4",
            "https://www.bing.com/fd/ls/l?IG=24FC99C70ECA42DF845585210A0953FC&Type=Event.CPT&DATA={%22pp%22:{%22S%22:%22L%22,%22FC%22:13,%22BC%22:357,%22SE%22:-1,%22TC%22:-1,%22H%22:412,%22BP%22:483,%22CT%22:484,%22IL%22:15},%22ad%22:[-1,-1,1905,990,1905,2092,0]}&P=SERP&DA=CO4&MN=SERP",

            // ftp urls
            "ftp://ftp.bogus.com/~some/path/to/a/file.txt",
            "ftp://foo.bar/baz",

            // uppercase
            "FTP://username:password@GOOGLE.COM",

            // file urls
            "file://localhost/D:/Desktop/Book.pdf",
            "file://localhost/home/name/Desktop/maxresdefault.jpg",
            "file:///home/name/Desktop/maxresdefault.jpg",

            // with non-ASCII characters
            "http://@www.subdomain.2-twitch.com.ac:8080/引き割り.html",
            "http://✪df.ws/123",
            "http://✪df.ws:9000/123",
            "http://✪df.ws:9000/",
            "http://✪df.ws:9000",
            "http://✪df.ws:9000*repeat",
            "http://✪df.ws*",
            "http://➡.ws/䨹",
            "http://⌘.ws",
            "http://⌘.ws/",
            "http://foo.com/unicode_(✪)_in_parens",
            "http://☺.damowmow.com/",
            "@www.subdomain.example.卷筒纸.com",
            "@www.subdomain.@example.卷筒纸.com",
            "username:password@www.subdomain.example.卷筒纸.com",
            "http://username:password@www@subdomain.example.卷筒纸.com",
            "http://username:password@www.subdomain.example.卷筒纸.com",
            "http://username:@www.subdomain.example.卷筒纸.com",
            "http://:password@www.subdomain.example.卷筒纸.com",
            "http://:@www.subdomain.example.卷筒纸.com",
            "http://stackoverflow.com/questions/2742852/これは、これを日本語のテキストです",
            "http://www.example.com/اسعارالعملات.aspx",
            "http://www.bing.com/images/search/?q=عربي",
            "https://www.yamsafer.me/مصر/القاهرة/فنادق-رخيصة",
            "http://globalmedia.cc/Testing/CMS/main/مسلسلات/مسلسلات%20كوميدية%20/يوميات%20ونيس/الحلقة%20الثالثة.mp3",
            "http://www.example.com/düsseldorf?neighbourhood=Lörick",
            "http://en.wikipedia.org/wiki/ɸ",
            "http://🐌🍏⌚✨😐😍🐸🍑.🍕💩.ws",
            "https://ka.wikipedia.org/wiki/მთავარი_გვერდი",

            // left/right punctuation (experimental)
            "reactionhttp://i.imgur.com/uIzTq4k.jpg",
            "())(*(&*http://username:password@www.subdomain.example.卷筒纸.com",
            "())(*(&*0390http://username:password@www.subdomain.example.卷筒纸.com",
            ">https://www.google.com",
            "(www.google.com)",
            "(&(*&(*(www.google.com",
            "(&(*&(*(www.google.com\")(*()*DS",
            "(en.c.org/a_(x)_(y))",
            "http://www.mysité.com/myresumé.html",
            "http://example.com/document.txt#match=[rR][fF][cC]",
            "[http://example.com/document.txt#match=[rR][fF][cC]",
            "(http://example.com/document.txt#match=[rR][fF][cC]]]",
            "[http://example.com/document.txt#match=[rR][fF][cC]]]]]",
            "<http://example.com/document.txt#match=[rR][fF][cC]]]",
            "]http://example.com/document.txt#match=[rR][fF][cC]",
            "(http://example.com/index.html#:words:some-context-for-a-(search-term))))",

            // localhost
            "http://localhost/projects/url-parser/parser/index.html",
            "http://localhost:9000/projects/url-parser/parser/index.html",
            "http://localhost:9000",
            "http://localhost:9000/",
            "localhost:9000/",
            "localhost:9000",
            "http://sub.localhost/projects/url-parser/parser/index.html",
            "sub.localhost/projects/url-parser/parser/index.html",
            "localhost/projects/url-parser/parser/index.html",
            "username:password@localhost/projects/url-parser/parser/index.html",
            "www.localhost/projects/url-parser/parser/index.html",
            "www.localhost",
            "localhost",

            // email like url
            "alex@arrayy.com",

            // punycode
            "http://www.google.xn--ntso0iqx3a.jp",
            "http://www.google.神奈川.jp",
            "http://www.google.xn--mix891f",
            "xn--bcher-kva.ch",
            "www.example.com",
            "example.com",
            "www.食狮.中国",
            "食狮.中国",
            "www.xn--85x722f.xn--55qx5d.cn",
            "xn--85x722f.xn--55qx5d.cn",

            // data: urls
            "data:,Hello%2C%20World!",
            "data:text/plain;base64,SGVsbG8sIFdvcmxkIQ%3D%3D",
            "data:text/html,%3Ch1%3EHello%2C%20World!%3C%2Fh1%3E",
            "data:text/html,<script>alert('hi');</script>",
            "data:image/png;base64,iVBORw0KGgoAAA==",
            "data:text/vnd-example+xyz;foo=bar;base64,R0lGODdh",
            "data:text/plain;charset=UTF-8;page=21,the%20data:1234,5678",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD///+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4Ug9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC",
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
            "data:text/plain;charset=utf-8,",

            // urls with errors
            "https://////////////////////////////////////sdf/////www.google.com////////////////?gws_rd=ssl",
            "http://223.255.255.254",
            "<img src='http://dummyimage.com/50'>",
            "http://example.com/index.html#!s3!search terms",
            "http://142.42.1.1/",
            "http://142.42.1.1:8080/",
            "127.0.0.1:8000/somethinghere",
            "http://مثال.إختبار",
            "http://例子.测试",
            "http://उदाहरण.परीक्षा",
            "@www.subdomain.example..卷筒纸.com",
            "www.subdomain.example..卷筒纸.com",
            "http://xn--fsqu00a.xn--3lr804guic/",
            "http://例子.卷筒纸",
            "http://例え.テスト/",
            ".com:9090/",
            "https://www./s/ref=nb_sb_noss_2",
            "www",
            "k12.ak.us",
            "vt.us",
            "ak.us",
            "aspasao)(asa^&%@(en.c.org/a_(x)_(y))",

        ];

        /**
         * @description [Parses provided JSON string and adds syntax highlighting.]
         * @param  {String|Object} json [The JSON string. Objects will be turned to string
         *                               vis JSON.stringify method.]
         * @param  {Number} spaces [The amount of spaces to indent by. If included an object
         *                          and not a string needs to be provided as the first argument]
         * @return {String}      [String with syntax highlighting.]
         * @source [http://stackoverflow.com/a/7220510]
         */
        var json_syntax_highlight = function(json, spaces) {
            if (spaces) {
                // turn provided object to string
                json = JSON.stringify(json, undefined, spaces);
            }
            json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
                var cls = "number";
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        // remove key surrounding quotes the quotes
                        match = match.replace(/^"/g, "").replace(/"\:$/g, ":");
                        cls = "key";
                    } else {
                        cls = "string";
                    }
                } else if (/true|false/.test(match)) {
                    cls = "boolean";
                } else if (/null/.test(match)) {
                    cls = "null";
                }
                return "<span class=\"" + cls + "\">" + match + "</span>";
            });
        };

        // create a fragment to add all elements to the DOM in 1 go
        var fragment = document.createDocumentFragment();

        // loop over test test pool
        for (var i = 0, l = pool.length; i < l; i++) {
            // cache test
            var test = parseURL(pool[i]); //, true); // suppress errors
            // add the test number to the test object
            test.test = i;
            var pre_element = document.createElement('pre');
            // log test information
            if (!test.error) {
                pre_element.classList.add("test-pass");
                var url = test.url;
                var padding = " ".repeat(test.punct.left.length);
                console.log(i, [test]);
                console.log("✔ " + padding + "%c" + url, "background: rgba(0, 0, 0, 0.01);color: #1a53ff");
                console.log("✔ %c" + test.source, "background: rgba(0, 0, 0, 0.01);color: #1a8703");
                console.log("");
            } else {
                pre_element.classList.add("test-fail");
                console.log(i + " ✘ %c[" + test.error.name.toUpperCase() + "]", "background: #ffe6e6; color: red", test.url, [test]);
                console.log("");
            }

            // parse url, stringify, add syntax highlighting, & finally set it to the be
            // the inner html of the created pre element
            pre_element.innerHTML = json_syntax_highlight(test, 4);
            // add the element to the fragment
            fragment.appendChild(pre_element);
        }

        // add the elements to the page
        document.body.appendChild(fragment);

    }

};
