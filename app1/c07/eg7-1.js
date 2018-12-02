var path = require('path');
var normalizedPath = path.normalize('/foo/bar//baz/asdf/quux/..');
console.log(normalizedPath);
// => '/foo/bar/baz/asdf'

var normalizedPath2 = path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
console.log(normalizedPath2);
// => '/foo/bar/baz/asdf'

var a = path.dirname('/abc/def/text.txt');
console.log(a);

var b = path.basename('/abc/def/text.txt');
console.log(b);