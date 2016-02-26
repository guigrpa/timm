# timm [![Build Status](https://travis-ci.org/guigrpa/timm.svg)](https://travis-ci.org/guigrpa/timm) [![Coverage Status](https://coveralls.io/repos/github/guigrpa/timm/badge.svg?branch=master)](https://coveralls.io/github/guigrpa/timm?branch=master) [![npm version](https://img.shields.io/npm/v/timm.svg)](https://www.npmjs.com/package/timm) 
Immutability helpers with fast reads and acceptable writes


## Installation

```
$ npm install --save timm
```


## Motivation

I know, I know... the world does not need yet another immutability library, especially with the likes of [ImmutableJS](http://facebook.github.io/immutable-js/) and [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) around. 

And yet... I felt the urge, at least just to cover my limited needs. ImmutableJS is a solid, comprehensive and highly-performant solution, but this power comes at a price: mixing up ImmutableJS's Maps and Lists with your plain objects can cause some friction, and reading those objects (in my case, more often than writing them) is not that convenient.

On the other side, seamless-immutable solves the "friction" problem by using plain objects and arrays, but seems to have some performance issues (at least in my benchmarks, see below).

Timm's approach: use plain objects and arrays and provide simple mutation functions that will probably not handle all edge cases. It is by no means a complete solution, but it covers 100% of my use cases and maybe 90% of yours, too. Suggestions are welcome!


## Benchmarks

I prepared an initial benchmarking tool comparing read/write speeds in four cases:

* In-place editing (mutable)
* ImmutableJS
* Timm
* Seamless-immutable

All four solutions are first verified for consistency (the mutable solution obviously does not pass all tests) and then benchmarked. Benchmarks cover reading and writing object attributes at different nesting levels (root level, 2 levels and 5 levels deep), as well as replacing an object in a 1000-long array.

Feel free to run them yourself (download the repo and then `npm install && npm run benchmarks`). These are my results on a Windows machine for 200k iterations:

![Benchmarks](https://github.com/guigrpa/timm/blob/master/docs/benchmarks-win7-20160219.png?raw=true)

Some conclusions from these benchmarks:

* Reads are on par with native objects/arrays and seamless-immutable, and faster than ImmutableJS (the deeper, the faster). In fact, you cannot go faster than native objects for reading!

* Writes are much slower than in-place edits, as expected, but are much faster than seamless-immutable (even in production mode), both for objects and arrays. Compared to ImmutableJS, object writes are faster (the deeper, the faster), whereas array writes are way slower. For timm and seamless-immutable, write times degrade linearly with array length (and probably object size), but much more slowly for ImmutableJS (logarithmically?). This is where ImmutableJS really shines.

* Hence, what I recommend (from top to bottom):

    - If you don't need immutability, well... just **mutate in peace!** I mean, *in place*
    - If you need a complete, well-tested, rock-solid library and don't mind using a non-native API for reads: use **ImmutableJS**
    - If you value using plain arrays/objects above other considerations, use **timm**
    - If your typical use cases involve much more reading than writing, use **timm** as well
    - If you do a lot of writes, updating items in long arrays or attributes in fat objects, use **ImmutableJS** 


## Usage

[[[API]]]


## MIT license

Copyright (c) [Guillermo Grau Panea](https://github.com/guigrpa) 2016

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
