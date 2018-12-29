var myLib = require('./addtwo');
var base = 10;

/*
    The result of the Node application is 12. 
    Declaring the new 'base' variable in the Node application had no impact on the value of base in the module, 
    because they both exist in different global namespaces.
*/
console.log(myLib.addtwo(base));

console.log(global);