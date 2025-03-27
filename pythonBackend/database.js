var http = require('http');

const server = http.createServer(function (req,res){
    res.writeHead(200, {'Contant-Type': 'Text/html'});
    res.end('Hello World');
})
server.listen(7777)