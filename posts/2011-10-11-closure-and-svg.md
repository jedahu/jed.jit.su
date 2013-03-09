---
title: Closure library and SVG without compiling
date: 2011-10-11
tags: [svg, closure, javascript]
---

Pop this in a `script` element.

    var CLOSURE_BASE_PATH = 'path/to/closure-library/closure/goog/';

    function CLOSURE_IMPORT_SCRIPT(src) {
      var s = document.createElementNS('http://www.w3.org/2000/svg', 'script');
      s.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);
      document.documentElement.appendChild(s);
      return true;
    }

Then load away.
