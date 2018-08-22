# timm [![Build Status](https://travis-ci.org/guigrpa/timm.svg)](https://travis-ci.org/guigrpa/timm) [![Coverage Status](https://coveralls.io/repos/github/guigrpa/timm/badge.svg?branch=master)](https://coveralls.io/github/guigrpa/timm?branch=master) [![npm version](https://img.shields.io/npm/v/timm.svg)](https://www.npmjs.com/package/timm)

Immutability helpers with fast reads and acceptable writes ([blog post](http://guigrpa.github.io/2016/06/16/painless-immutability/))


## Installation

```
$ npm install --save timm
```


## Motivation

I know, I know... the world doesn't need yet another immutability library, especially with the likes of [ImmutableJS](http://facebook.github.io/immutable-js/) and [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) around.

And yet... I felt the urge, at least just to cover my limited needs. ImmutableJS is a solid, comprehensive and highly-performant solution, but this power comes at a price: mixing up ImmutableJS's Maps and Lists with your plain objects can cause some friction, and reading those objects (in my case, more often than writing them) isn't that convenient.

On the other side, *seamless-immutable* solves the "friction" problem by using plain objects and arrays, but seems to have some performance issues (at least in my benchmarks, see below).

*timm*'s approach: use plain objects and arrays and provide simple mutation functions to handle most common operations (suggestions are welcome!). As a bonus, *timm* creates new objects *lazily*, when it confirms that the operation will mutate the input object; in other words, **operations that don't modify an object always return the object itself**. This alleviates pressure on the garbage collector and lets you easily check whether an object changed after an operation: `merge(obj, { a: 3 }) === obj`.

**Important notice:** *timm* does *not* freeze the objects it provides. In other words, it doesn't protect you against inadvertently modifying them in your code. I considered deeply freezing all objects with `Object.freeze()`, but it is really slow. Then I considered doing this only in development (like [*seamless-immutable*](https://github.com/rtfeldman/seamless-immutable#performance)), but then modifying frozen objects will silently fail in development (unless you `use strict` in your code), and –worse still– succeed in production. Not good. In conclusion, **be careful** (or send me a suggestion to work around this!).

...Oh, I almost forgot! It's **tiny: just ~200 LOC and ~1.5 kB minified & compressed!**

## Benchmarks

I prepared an initial benchmarking tool comparing read/write speeds in four cases:

* In-place editing (mutable)
* [ImmutableJS](http://facebook.github.io/immutable-js/)
* [timm](https://github.com/guigrpa/timm)
* [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)
* [immutability-helper](https://github.com/kolodny/immutability-helper)

All five solutions are first verified for consistency (the mutable solution obviously does not pass all tests) and then benchmarked. Benchmarks cover reading and writing object attributes at different nesting levels (root level, 2 levels and 5 levels deep), merging two small objects, and replacing an object in a 1000-long array.

Feel free to run them yourself (download the repo and then `npm install && npm run benchmarks`). These are my results on OS X for 200k iterations (Node v8.6.0):

![Benchmarks](https://github.com/guigrpa/timm/blob/master/docs/bechmarks-osx-20180822-node9.11.png?raw=true)

Some conclusions from these benchmarks:

* Reads are on par with native objects/arrays, *seamless-immutable* and *immutability-helper*, and faster than *ImmutableJS* (the deeper, the faster, even though *ImmutableJS* has improved read performance substantially in recent versions). In fact, you cannot go faster than native objects for reading!

* Writes are much slower than in-place edits, as expected, but are much faster than *seamless-immutable* (even in production mode) and *immutability-helper*, both for objects and arrays. Compared to *ImmutableJS*, object writes and merges are faster (the deeper, the faster), whereas array writes are way slower (not as slow as *seamless-immutable* and *immutability-helper*, though). For *timm* and *seamless-immutable*, write times degrade linearly with array length (and probably object size), but much more slowly for *ImmutableJS* (logarithmically?). This is where *ImmutableJS* really shines.

* Hence, what I recommend (from top to bottom):

    - If you don't need immutability, well... just **mutate in peace!** I mean, *in place*
    - If you need a complete, well-tested, rock-solid library and don't mind using a non-native API for reads: use **ImmutableJS**
    - If you value using plain arrays/objects above other considerations, use **timm**
    - If your typical use cases involve much more reading than writing, use **timm** as well
    - If you do a lot of writes, updating items in long arrays or attributes in fat objects, use **ImmutableJS**


## Usage

```js
import { merge, set as timmSet } from 'timm';
const obj = merge({ a: 2 }, { b: 3 });
const obj2 = timmSet({ foo: 1}, 'bar', 2);
```

[[[./src/timm.js]]]


## MIT license

Copyright (c) [Guillermo Grau Panea](https://github.com/guigrpa) 2016-present

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
