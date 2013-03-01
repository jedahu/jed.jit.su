/* !meta
{ "title": "A simple server"
, "author": "Jeremy Hughes <jedahu@gmail.com>"
, "date": "2013-02
}
*/
var http = require('http');
var url = require('url');
var send = require('send');
var app = http.createServer(function(req, res) {
  function redirect() {
    res.statusCode = 301;
    res.setHeader('Location', req.url + '/');
    res.end('Redirecting to ' + req.url + '/');
  }
  send(req, url.parse(req.url).pathname)
    .root('static')
    .on('directory', redirect)
    .pipe(res);
}).listen(3000);
