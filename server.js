/* !meta
{ "title": "A simple dev server"
, "author": "Jeremy Hughes <jedahu@gmail.com>"
, "date": "2013-01
}
*/
var static = require('node-static');
var file = new static.Server('.');
var http = require('http');

http.createServer(function(request, response) {
  request.addListener('end', function() {
    file.serve(request, response);
  });
}).listen(8080);
