/**
 * @description  [The Punycode library.]
 * @type {Object}
 */
var punycode = window.app.libs.punycode;
// =============================== Core Library Functions
/**
 * @description  [Object contains functions used alongside the array `map`
 *                method. The functions are placed outside of the loop to stop
 *                JSLint from complaining.]
 * @type {Object}
 */
var map = {
    "punycodeUnicode": function(item, i, array) {
        // convert to Unicode
        return punycode.toUnicode(item);
    },
    "punycodeASCII": function(item, i, array) {
        // convert to ASCII
        return punycode.toASCII(item);
    }
};
