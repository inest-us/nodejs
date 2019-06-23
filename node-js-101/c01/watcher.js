var fs = require('fs');
var path = require('path');
var fileName = "target.txt";
var filePath = path.resolve(__dirname, fileName);
console.log(filePath);

fs.watch(filePath, function() {
    console.log('tartget file has changed');
})