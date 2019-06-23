var myModule = require('./myModule');
var circle = require('./circle');

myModule.printA(); // -> A
myModule.printB(); // -> B

console.log(circle.circle(1, 2, 3).area());