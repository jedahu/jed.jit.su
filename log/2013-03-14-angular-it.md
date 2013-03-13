---
title: Async 'it' for testing Angular with Mocha
date: 2013-03-14
tags: [javascript, angular, mocha]
---

[Angular’s][Angular] `$rootScope.$evalAsync` completes during the next
`$digest`. This creates a problem when testing with [Mocha][] because there is
nothing causing digests to be run. The solution below creates an ‘async’ `it`
that calls `$root.$digest` in a loop until the test code calls the `done`
callback.

    function ngIt($injector) {
      return function(text, fn) {
        it(text, function(done) {
          var $rootScope = $injector.get('$rootScope');
          var fin;
          var finished = function(err) {
            fin = true;
            done(err);
          };
          fn(finished);
          while (!fin) {$rootScope.$digest()}
          $rootScope.$digest();
        })
      }
    }

Set it up like this:

    var $it = ngIt(angular.injector(['ng', 'YourModule']);

And use in place of `it`:

    describe('thing', function() {
      $it('should do stuff', function(done) {
        test.with.$evalAsync.callback(function() {
          // test stuff
          if (pass) done();
          else done(error);
        });
      });
    });

[Angular]: http://angularjs.org
[Mocha]: http://visionmedia.github.com/mocha/
