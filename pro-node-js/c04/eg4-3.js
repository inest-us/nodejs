var utf8String = 'my string';
var buf = new Buffer(utf8String);
console.log(buf.toString()); //my string

var base64String = buf.toString('base64');
console.log(base64String); //bXkgc3RyaW5n