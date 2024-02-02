var http = require('http');

var server = http.createServer(function(request, response) {

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Welcome to Sample the Node.js application!");

});

var port = 5000;
server.listen(port);
module.exports = server
console.log("Server is available on Port:", port);
