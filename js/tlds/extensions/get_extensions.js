// [source](http://www.webopedia.com/quick_ref/fileextensionsfull.asp)

// Step 1: Run the code below in the console of the above source...
// copy the outputted list...

var extensions = [];
// get the correct table
var table = document.getElementsByTagName("tbody")[1];
// get the tables children
var children = table.children;
// loop over the children
for (var i = 1, l = children.length; i < l; i++) {
    // skip the first child
    var child = children[i];
    var extension = child.children[0].textContent;
    if (extension === "") continue;
    extensions.push(extension.replace(/^\./, ""));
}
// console.log(extensions.length, extensions);
document.write(JSON.stringify(extensions));


// [source](https://www.sitepoint.com/web-foundations/mime-types-complete-list/)

// Step 2: Run the code below in the console of the above source...
// copy the outputted list...

var extensions = [];
// get the correct table
var table = document.getElementsByTagName("tbody")[0];
// get the tables children
var children = table.children;
// loop over the children
for (var i = 1, l = children.length; i < l; i++) {
    // skip the first child
    var child = children[i];
    var extension = child.children[0].textContent;
    if (extension === "") continue;
    extensions.push(extension.replace(/^\./, ""));
}
// console.log(extensions.length, extensions);
document.write(JSON.stringify(extensions));

// Step 3: Combine the arrays and make it unique to get the file extensions list...

extensions = extensions.concat(a);

function make_unique(array, flag_sort) {
    // make array unique
    array = array.filter(function(x, i, a_) {
        return a_.indexOf(x) === i;
    });
    // sort the array if flag set
    // **Note: does not sort numbers
    if (flag_sort) {
        if (flag_sort === "alpha") {
            array = array.sort(function(a, b) {
                return a.localeCompare(b);
            });
        } else if (flag_sort === "number") {
            array.sort(function(a, b) {
                return a - b;
            });
        }
    }
    // return the array
    return array;
}
var c = make_unique(extensions);
document.write(JSON.stringify(c));