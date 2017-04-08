// to use: go to => http://www.iana.org/domains/root/db
// ...and paste following code into console.
// code gets all tlds and places them into its level
// levels: generic, sponsored, generic_restricted, country code, infrastructure, & test
/**
 * @description [Formats tlds into an object. Keys are the first char of the tld and its
 *               value is an array of all the tlds sorted alphabetically and from shortest to longest.]
 * @param {Array} tlds [The array of tlds to format.]
 * @return {Null}      [Writes object to dom to easily copy.]
 */
function format_tlds(tlds) {
    var formated = {};
    for (var i = 0, l = tlds.length; i < l; i++) {
        // get the first char
        if (!formated[tlds[i][0]]) {
            // this is the first one
            formated[tlds[i][0]] = [tlds[i]];
        } else {
            var letter = formated[tlds[i][0]];
            letter.push(tlds[i]);
            formated[tlds[i][0]] = letter;
        }
    }
    for (var key in formated) {
        formated[key].sort(function(a, b) {
            return a.length - b.length;
        });
    }
    // print the formated tlds object to the document
    document.write(JSON.stringify(formated));
}
var elements = document.getElementsByClassName("tld");
var tlds = [];
for (var i = 0, l = elements.length; i < l; i++) {
    tlds.push(elements[i].textContent.replace(/^\./, ""));
}
console.log(tlds);
// print the tlds object to the document to copy
format_tlds(tlds);
