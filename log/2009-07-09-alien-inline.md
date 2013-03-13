---
title: 'alien.inline: inline C for factor'
date: 2009-07-09
tags: [factor]
---

**15/7/2009** updated example to match source changes

Factor's FFI is rather nice in that it doesn't use C headers, however
there are still times when writing a little glue code in C is necessary
(e.g. to make macro values or C++ methods available to the factor FFi).
This task is made more tractable by `alien.inline` which enables writing
C code in factor vocabularies. Said code is automatically compiled and
linked to when the vocabulary is loaded.

Here is a short example:

    USING: alien.inline.syntax ;
    IN: inline-test

    C-LIBRARY: short-example

    COMPILE-AS-C++

    C-INCLUDE: <string>

    C-TYPEDEF: std::string stdstr

    C-FUNCTION: stdstr* new_std_str ( const-char* s )
        stdstr* x = new stdstr(s);
        return x;
    ;

    ALIAS: <stdstr> new_std_str

    C-FUNCTION: const-char* std_to_c_str ( stdstr* s )
        return s->c_str();
    ;

    ALIAS: std>c-str std_to_c_str

    C-STRUCTURE: rectangle
        { "int" "width" }
        { "int" "height" } ;

    C-FUNCTION: int area ( rectangle c )
        return c.width * c.height;
    ;

    ;C-LIBRARY

and output, which is no different to normal FFI usage:

    ( scratchpad ) "abc" <stdstr>

    --- Data stack:
    ALIEN: 16240640
    ( scratchpad ) std>c-str

    --- Data stack:
    "abc"
    ( scratchpad ) "rectangle" <c-object> 3 over set-rectangle-width 5 over set-rectangle-height

    --- Data stack:
    B{ 3 0 0 0 5 0 0 0 }
    ( scratchpad ) area

    --- Data stack:
    15

All the parsing words. Some of them perform the same function as their
analogues in alien.syntax, but also generate the equivalent C code. Each
parsing word has a runtime equivalent.

- `C-LIBRARY: name`: sets up variables
- `COMPILE-AS-C++`: treat generated code as C++
- `C-INCLUDE: name`: generates `#include name`
- `C-LINK: name`: adds `-lname` to linker command
- `C-FRAMEWORK: name`: adds `-framework name` to linker command (OS X only)
- `C-LINK/FRAMEWORK: name`: equivalent to `C-FRAMEWORK:` on OS X and `C-LINK:`
  everywhere else
- `C-TYPEDEF: old new`: like `TYPEDEF:` but generates a C typedef statement too
- `C-STRUCTURE: name pairs... ;`: like `C-STRUCT:` but also generates
  equivalent C code
- `C-FUNCTION: return name args body... ;`: like `FUNCTION:` but with a
  function body written in C or C++
- `RAW-C: multiline-string ;`: insert a string into the generated C/C++ file;
  useful for macros and other details not implemented in `alien.inline`; works
  the same as `STRING:`
- `;C-LIBRARY`: writes, compiles, and links generated code, then calls
  `add-library`; does nothing if the shared library is younger than the factor
  source file
- `DELETE-C-LIBRARY: name`: delete the shared library file corresponding to
  `name` (must be executed in the vocabulary where `name` is defined); mainly
  useful in unit tests

The library file produced by the above example would be named
`libinline-test_short-example`; factor would see it as
`inline-test_short-example`. Source and unlinked object files are
written to `resource:temp/` and linked libraries are written to
`resource:alien-inline-libs/`.

As of 9/7/2009 alien.inline is brand new, so there likely will be corner
cases it does not handle so well. If you run into trouble, pipe up on
the factor mailing list or look for jedahu on \#concatenative.

Next up:
[`alien.marshall`](/2009/07/alienmarshall-marshalling-between.html)…
