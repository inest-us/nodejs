var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

http.createServer(function (req, res) {
    var name = url.parse(req.url, true).query.name;
    if (name === undefined) {
        name = 'world';
    }
    if (name === 'burningbird') {
        var fileName = 'phoenix5a.png';
        var filePath = path.resolve(__dirname, fileName);
        /*
            The fs.stat() method not only verifies that the file exists but also returns an object with information about the file, including its size.
        */
        fs.stat(filePath, function (err, stat) {
            /*
                The fs.stats() method uses the standard Node callback function pattern with the error value as the first parameter — frequently called an errback.
            */
           if (err) {
              console.error(err);
              res.writeHead(200, {'Content-Type': 'text/plain'});
              res.end("Sorry, Burningbird isn't around right now \n");
           } else {
              var img = fs.readFileSync(filePath);
              res.contentType = 'image/png';
              res.contentLength = stat.size;
              res.end(img, 'binary');
           }
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('Hello ' + name + '\n');
    }
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
