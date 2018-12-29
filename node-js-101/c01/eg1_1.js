/*
    First, it includes the module necessary to run a simple HTTP server: 
    the appropriately named HTTP module.

    The module is imported using the Node 'require' statement, and the result assigned to a local variable.
*/
var http = require('http');

/*
    External functionality for Node is incorporated via modules that export specific types of functionality that can then be used in an application
    They’re very similar to the libraries you’ve used in other languages.
*/
http.createServer(function (request, response) {
    /*
        In the function parameters, we see one of the fundamental constructs of Node: 
        the callback. It’s the anonymous function that’s passing the web request and response into the code to process the web request and provide a response.
    */
    /*
        JavaScript is single-threaded, and the way Node emulates an asynchronous environment in a single-threaded environment is via an event loop, 
        with associated callback functions that are called once a specific event has been triggered. 
        In this example, when a web request is received, the callback function is called.
    */
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello World\n');
}).listen(8080);

console.log('Server running at http://127.0.0.1:8080/');
