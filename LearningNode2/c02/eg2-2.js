"use strict";

/*
    A Node buffer is raw binary data that’s been allocated outside the V8 heap. 
    It’s managed via a class, the Buffer. Once allocated, the buffer can’t be resized. 
    The buffer is the default data type for file access: unless a specific encoding is provided when reading and writing to a file, the data is read into, or out of, a buffer.
*/
/*
    You can directly create a new buffer by passing the constructor function an array of octets, another buffer, or a string. 
    The buffer is created with the copied contents of all three.
*/
let buf = new Buffer('This is my pretty example');
console.log(buf.length); //=> 25

/*
    Buffers can convert to JSON, as well as strings.
*/
let json = JSON.stringify(buf);  
console.log(json); 
/*
=> {"type":"Buffer","data":[84,104,105,115,32,105,115,32,109,121,32,112,114,101,116,116,121,32,101,120,97,109,112,108,101]}
   The JSON specifies that the type of object being transformed is a Buffer, and its data follows.
*/

/*
    To go full circle, we can parse the buffer data back out of the JSON object, and then use the Buffer.toString() method to convert to a string,
*/
let buf2 = new Buffer(JSON.parse(json).data);
console.log(buf2.toString()); // => this is my pretty example

/*
The toString() function converts the string to UTF-8 by default, but if we wanted other string types, we’d pass in the encoding:
*/
console.log(buf2.toString('ascii')); //=> this is my pretty example 

/*
We can also specify a starting and ending place in the string conversion: 
*/
console.log(buf2.toString('utf8', 11, 17)); //=> pretty