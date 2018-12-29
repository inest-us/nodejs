var base = 2;

/*
    exports is a Node global objects
*/

/*
    We’ll create it as a JavaScript library to use in a web page, and as a module to use in a Node application.
    using Node module syntax.
*/
exports.addtwo = function(input) {
  return parseInt(input) + base;
};