var path = require('path');
var normalizedPath = path.normalize('/foo/bar//baz/asdf/quux/..');
console.log(normalizedPath);
// => '/foo/bar/baz/asdf'

var normalizedPath2 = path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
console.log(normalizedPath2);
// => '/foo/bar/baz/asdf'