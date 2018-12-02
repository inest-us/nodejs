'use strict';

/*
    StringDecoder: This object’s sole purpose is to decode buffer values to UTF-8 strings, 
    but it does so with a little more flexibility and recoverability.
*/
let StringDecoder = require('string_decoder').StringDecoder;
let decoder = new StringDecoder('utf8');

/*
    An example of the differences between the string conversion routines is in the following Node application. 
    The euro symbol (€) is coded as three octets, but the first buffer only contains the first two octets. The second buffer contains the third.
*/
let euro = new Buffer([0xE2, 0x82]);
let euro2 = new Buffer([0xAC]);

/*
    The StringDecoder, on the other hand, buffers the incomplete sequence until it’s complete and then returns the result. 
    If you’re receiving a UTF-8 result as chunks in a stream, you should use StringDecoder.
*/
console.log(decoder.write(euro)); //=> blank line
console.log(decoder.write(euro2)); //=> €

/*
    If the buffer.toString() method gets an incomplete UTF-8 character sequence, it returns gibberish.
*/
console.log(euro.toString()); // => ��
console.log(euro2.toString()); // => �


/*
    You can also convert a string to an existing buffer using buffer.write(). 
    It’s important, though, that the buffer be correctly sized to hold the number of octets necessary for the characters. 
    Again, the euro symbol requires three octets to represent it  ( 0xE2, 0x82, 0xAC):
*/
/*
    This is also a good demonstration that the number of UTF-8 characters (number of character is 1: €) 
    is not equivalent to the number of octets in the buffer (buffer's length is 3)
*/
let buf = new Buffer(3); 
buf.write('€','utf-8');
console.log(buf); //=> <Buffer e2 82 ac>