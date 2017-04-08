// to use: go to => http://www.iana.org/domains/root/db
// ...and paste following code into console.
// code gets all tlds and places them into its level
// levels: generic, sponsored, generic_restricted, country code, infrastructure, & test
var elements = document.getElementById("tld-table").getElementsByTagName("tr");
var tlds = {};
for (var i = 0, l = elements.length; i < l; i++) {
    if (i === 0) continue;
    // get the cells
    var cells = elements[i].cells,
        domain = cells[0].textContent.trim().replace(/\./g, ""),
        type = cells[1].textContent.trim().replace(/\-/g, "_");
    if (!tlds[type]) {
        // first entry for that type
        tlds[type] = [domain];
    } else {
        // already exists just push to array
        tlds[type].push(domain);
    }
}
console.log(tlds);
// print the tlds object to the document to copy
document.write(JSON.stringify(tlds));
