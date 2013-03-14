/* !meta
{ "title": "A simple server"
, "author": "Jeremy Hughes <jedahu@gmail.com>"
, "date": "2013-02
}
*/
var express = require('express');
var app = express();
var legacy = express();
var poet = require('poet')(app);
var markdown = require('markdown').markdown;
var stylus = require('stylus');
var nib = require('nib');

legacy.all('*', function(req, res) {
  console.log(req.path);
  res.redirect('http://jedahu.net' + req.path);
});

poet
  .set({
    posts: './log/',
    postsPerPage: 100,
    metaFormat: 'yaml',
    readMoreLink: function(post) { return ''; }
  })
  .addTemplate({
    ext: 'md',
    fn: function(text) { return markdown.toHTML(text, 'Maruku'); }
  })
  .createPostRoute('/log/:post', 'post')
  .createPageRoute('/pagination/:page', 'page')
  .createTagRoute('/tag/:tag', 'tag')
  .createCategoryRoute('/category/:category', 'category')
  .init(function(locals) {})

function compileStyl(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib());
}

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.vhost('log.jedahu.net', legacy));
app.use(stylus.middleware({
  src: __dirname + '/stylus',
  dest: __dirname + '/static',
  compile: compileStyl,
  compress: true
}));
app.use(express.static(__dirname + '/static'));
app.use(poet.middleware());
app.get('/log', function(req, res) { res.render('index'); });
app.use(app.router);
app.listen(3000);
