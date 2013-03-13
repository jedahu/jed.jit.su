---
title: 'alien.marshall: marshalling between factor and C'
date: 2009-07-17
tags: [factor]
---

[`alien.inline`](/2009/07/introducing-alieninline-vocabulary-for.html)
is nice, but it would be even nicer to have factor values automatically
marshalled to and from their C equivalents. `alien.marshall` enables
this.

A short example:

    USING: alien.inline.syntax alien.marshall.syntax ;
    IN: marshall-test

    C-LIBRARY: short-example

    CM-STRUCTURE: rectangle
       { "int" "width" }
       { "int" "height" } ;

    CM-FUNCTION: int area ( rectangle c )
       return c.width * c.height;
    ;

    CM-FUNCTION: void incr ( int* a, int delta )
       *a += delta;
    ;

    ;C-LIBRARY

and output:

    ( scratchpad ) <rectangle> 3 >>width 5 >>height

    --- Data stack:
    T{ rectangle f ALIEN: 36777744 f }
    ( scratchpad ) area

    --- Data stack:
    15
    ( scratchpad ) 3 incr

    --- Data stack:
    18

As you can see, struct fields are marshalled, as are struct arguments.
Output parameters are unmarshalled and pushed on the stack after the
return value (if not void).

Non–false `c-ptrs` are not marshalled, they are passed to the C function
unchanged. It is assumed that if you pass a `c-ptr` you know what you
are doing and can clean up after yourself.

Return values and output parameters which are pointers, are assumed to
be pointers to a single value. Factor words which call C functions
returning pointers to arrays (single or multi–dimensional) will need to
include hand–coded unmarshalling.

Return pointers and output pointers are freed after unmarshalling.
Struct fields are an exception to this: fields containing pointers will
need to be explicitly freed once the struct is no longer needed
(overriding the struct’s `dispose*` method is a good way to do this).

`alien.marshall`words follow the same pattern as `alien.inline`, but
with a `CM-` prefix instead of `C-`.

There are also `M-` prefixed words. These do not generate C code. They
behave like their counterparts in `alien.syntax` with the addition of
marshalling and unmarshalling of values.

Next up: `alien.c++-templates`…
