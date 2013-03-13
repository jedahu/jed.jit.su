---
title: Simple enum macro for sweet.js
date: 2013-03-14
tags: [javascript, macros]
---

Implementation:

    macro $enum {
      case $name:ident {$val:ident (,) ...} => {
        var $name = {$($val: null) (,) ...};
        for (var k in $name) {
          $name[k] = k;
        }
        Object.freeze($name);
      }
    }

Once [sweet.js][] has syntax-case the for-loop will be unnecessary.

Use:

    $enum Suites { CLUBS, SPADES, HEARTS, DIAMONDS }

Which is equivalent to:

    var Suites = Object.freeze({
      CLUBS: 'CLUBS',
      SPADES: 'SPADES',
      HEARTS: 'HEARTS',
      DIAMONDS: 'DIAMONDS'
    });

[sweet.js]: http://sweetjs.org
