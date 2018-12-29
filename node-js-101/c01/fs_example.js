var fs = require('fs');
var path = require('path');
var fileName = "test.txt";
var filePath = path.resolve(__dirname, fileName);
console.log(filePath);

fs.exists(filePath, function(exists) {
  if (exists) {
    fs.stat(filePath, function(error, stats) {
      fs.open(filePath, "r", function(error, fd) {
        var buffer = new Buffer(stats.size);

        fs.read(fd, buffer, 0, buffer.length, null, function(error, bytesRead, buffer) {
          var data = buffer.toString("utf8", 0, buffer.length);

          console.log(data);
          fs.close(fd);
        });
      });
    });
  }
});