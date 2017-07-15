var buffer = new Buffer("this is the content of my buffer");
var smallerBuffer = buffer.slice(8, 19);
console.log(smallerBuffer.toString()); // -> "the content"