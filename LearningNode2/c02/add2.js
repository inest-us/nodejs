/*
    In the browser, when you declare a variable at the top level, it’s declared globally. 
    It doesn’t work that way in Node. When you declare a variable in a module or application in Node, 
    the variable isn’t globally available; it’s restricted to the module or application.
*/

/*
    We’ll create it as a JavaScript library to use in a web page, and as a module to use in a Node application.
*/
var base = 2;

function addtwo(input) {
   return parseInt(input) + base;
}