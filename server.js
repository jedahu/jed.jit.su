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

legacy.all('*', function(req, res) {
  console.log(req.path);
  res.redirect('http://jedahu.net' + req.path);
});

poet
  .set({
    posts: './posts/',
    postsPerPage: 100,
    metaFormat: 'yaml',
    readMoreLink: function(post) { return ''; }
  })
  .createPostRoute('/post/:post', 'post')
  .createPageRoute('/pagination/:page', 'page')
  .createTagRoute('/tag/:tag', 'tag')
  .createCategoryRoute('/category/:category', 'category')
  .init(function(locals) {})

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.vhost('log.jedahu.net', legacy));
app.use(express.static(__dirname + '/static'));
app.use(poet.middleware());
app.get('/post', function(req, res) { res.render('index'); });
app.use(app.router);
app.listen(3000);
