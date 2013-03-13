---
title: Why I like Factor
date: 2010-08-20
tags: [factor]
---

[Factor](http://factorcode.org/) is a relatively new language and
implementation in the tradition of Forth, Lisp, and Smalltalk. Like
Forth, Factor is concatenative and uses a postfix syntax. Also like
Forth, Factor emphasises small procedures and constant refactoring. Like
many Lisp and Smalltalk implementations, Factor compiles code into a
loadable image. Like Lisp, Factor can perform arbitrary computation at
compile time using macros while parse time evaluation allows the
creation of new syntax forms.

Unlike Forth, Lisp, and Smalltalk, Factor is modern and unencumbered.
Lisp suffers from an ossified specification, Smalltalk has lived inside
its own image for so long it's out of touch with the rest of the world,
and Forth provides few of Factor's higher level features like garbage
collection and dynamic code updating.

Factor’s focus on correctness and efficiency is not commonly found in
other modern ‘dynamic’ languages. The results speak for themselves.

*1. Factor vocabularies are compiled to machine code.* When using the
interactive listener the code is compiled before execution (like SBCL).

*2. Factor is fast.* Not C fast, but SBCL fast.

*3. Almost all structures are modifiable at runtime.* This includes
classes at any position in the hierarchy as well as FFI bindings. When
reloading a modified vocabulary, definitions no longer present will be
deleted from the running image. These changes are propagated to all
dependent code and the changes to the running image are kept consistent.

*4. A simple foreign function interface.* No quirky header files or IDL
necessary; everything is done from within Factor. No reloading of Factor
necessary either: create bindings incrementally and test them as you go.

*5. Deployment images.* Factor’s deployment tool only loads code the
resultant binary will run. Minimal image size for a hello world program
is a few hundred kilobytes.

*6. Common Lisp style condition system.* Don’t let stack unwinding lose
an exception’s context. Recover anywhere between where the exception is
caught and where it was thrown.

#### Why having a competent designer pays off

In contrast to other popular languages like Ruby and Python, Factor does
not suffer from limiting creeds like, “There should be one way to do
it,” or from BDFLs who don’t see the value in useful language constructs
discovered as early as the 70s. Here's the payoff...

*7. Correct lexical scoping.* Usually in Factor one uses its postfix
syntax and data flow combinators, however it also sports a locals
vocabulary defined entirely in factor which implements lexical scoping
and lambdas. Despite the fact that this is an addition in a language
where lexical variables are not the default, Factor's lexical scoping is
correct and its lambdas are uncrippled. Python 2.x is unable to rebind a
variable in a parent scope (3.x overcomes this by introducing a new
keyword, ugh!), and Ruby only recently (1.9) gave blocks their own
scope.

*8. Usable higher order functions.* Combinators are used in Factor all
the time. For some unfathomable reason Ruby allows only one block
argument per function while in Python the use of such esoterica as `map`
and `reduce` is discouraged.

*9. Tail call optimization.* Yep, that’s right, that helpful recursion
thingy. Another thing Python doesn't have because, oh I don’t know, [ask
Guido](http://neopythonic.blogspot.com/2009/04/tail-recursion-elimination.html).
Come to Factor and free your mind from loopiness!

*10. Low, hi, and FFI.* Factor scales well from highly abstracted
garbage collected code, to micro optimization using inline ASM. Along
the way, the FFI allows Factor quotations to be used as C callbacks, and
provides factor-side memory allocation should you need to store values
on the stack or in a memory pool.

*11. Methods are orthogonal to classes.* Generic words and their methods
are defined outside classes. Adding a generic word to a preexisting
class is as simple as defining it. Extensibility without nasty monkey
patching or name clashes, and a nice fit with a hierarchy that can
contain anything from tuples, to predicate classes and C structs. No
hideously bloated base-class needed (I'm looking at you
[Smalltalk](http://www.oldenbuettel.de/squeak-doku/Kernel-Objects/Object.html)).
If Programmer Pooh adds a `display-in-opengl` method to `object` he need
not modify core code, nor will his method clash with any present or
future methods on `object`.

#### Why having a smart community pays off

Smart, or at least willing to learn new things.

*12. No whiners!* Try educating a bunch of Blub programmers in the
utility of higher order functions or tail-recursion...

*13. Macros, syntax, and combinators, oh my!* If you don’t whine, you
get cool stuff. Macros akin to those in Common Lisp, but hygienic like
Scheme, because if you don’t have variables, you can’t capture them.
Syntax words like Lisp’s reader macros, but better because no dispatch
character craziness is necessary. Observe the usefulness of regular
expressions that are syntax checked at parse time, or the
[EBNF](http://docs.factorcode.org/content/article-peg.ebnf.html)
vocabulary which compiles an inline EBNF description into parsing code.
For higher order goodness check out Factor’s unique [dataflow
combinators](http://docs.factorcode.org/content/article-dataflow-combinators.html).
This is not your ancestor’s stack shuffling!

#### More stuff I like

*14. Live documentation.* Factor has live documentation ala Emacs, but
prettier and better linked. The documentation is contained in separate
files to the code it describes. For those of us who hate hunting for
scratchings of code amid screeds of API comments, this is a good thing.

#### An acceptable Lisp?

Someone once
[wrote](http://www.randomhacks.net/articles/2005/12/03/why-ruby-is-an-acceptable-lisp)
about Ruby being an acceptable Lisp. They were wrong. Ruby doesn’t have
macros, reader macros, native compilation, or a REPL from which
everything can be modified. (Oh, but it does have three different kinds
of lambda!)

Factor isn’t an acceptable Lisp either. Factor is a mighty fine Lisp.
Factor is better than Lisp. It has all the things that make Lisp great
and more. Factor will make your code beautiful. Factor will cook you
breakfast. Factor reads like English, (lisp (like (not))). [All hail
Factor!](http://twitter.com/slava_pestov/statuses/12308204789)

#### Summation

I like Factor because it hits the sweet spot of pandering to nothing but
being a great language. It lifts much of the good stuff from great
languages of yore and gives them an improved spin. It hasn’t yet
succumbed to the whining hordes of mediocrity. It is written by a team
that really know what they are doing. If that doesn’t describe your
language, then [give Factor a try.](http://factorcode.org)
