# timm
Immutability helpers with fast reads and acceptable writes


## Install

```
$ npm install --save timm
```


## Motivation

I know, I know... the world does not need yet another immutability library, especially with the likes of [ImmutableJS](http://facebook.github.io/immutable-js/) and [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) around. 

And yet... I felt the need, at least just to cover my limited needs. ImmutableJS is a solid, comprehensive and highly-performant solution, but this power comes at a price: mixing up ImmutableJS's Maps and Lists with your plain objects can cause some friction, and reading those objects (in my case, more often than writing them) is not that convenient.

On the other side, seamless-immutable solves the "friction" problem by using plain objects and arrays, but seems to have some performance issues (at least in my benchmarks, see below).

Timm's approach: use plain objects and arrays and provide simple mutation functions that will probably not handle all edge cases. It is by no means a complete solution, but it covers 100% of my use cases and maybe 90% of yours, too. Suggestions are welcome!

## Benchmarks

I prepared an initial benchmarking tool comparing read/write speeds in four cases:

* In-place editing (mutable)
* ImmutableJS
* Seamless-immutable
* Timm

All four solutions are first verified for consistency (the mutable solution obviously does not pass all tests) and then benchmarked. Benchmarks cover reading and writing object attributes at different nesting levels (root level, 2 levels and 5 levels deep). They do not cover arrays for the moment (coming up!).

Feel free to run them yourself (download the repo and then `npm install && npm run benchmarks`). These are my results on a Windows machine for 200k iterations:

![Benchmarks](https://github.com/guigrpa/timm/blob/master/docs/benchmarks-win7-20160218.png?raw=true)

Reads are roughly on par with native objects/arrays and seamless-immutable, and faster than ImmutableJS (the deeper, the faster). Writes are much slower than in-place edits, as expected, but are much faster than seamless-immutable (even in production mode). Write performance is somewhat comparable to ImmutableJS's, at least for deep writes. Shallower writes are slower, but in the same order of magnitude.

## Usage

### Arrays

#### addLast()
Returns a new array with an appended item.

Usage: `addLast(array: Array, val: any): Array`

```js
arr = ['a', 'b']
arr2 = addLast(arr, 'c')
// [ 'a', 'b', 'c' ]
arr2 === arr
// false
```

#### addFirst()
Returns a new array with a prepended item.

Usage: `addFirst(array: Array, val: any): Array`

```js
arr = ['a', 'b']
arr2 = addFirst(arr, 'c')
// [ 'c', 'a', 'b' ]
arr2 === arr
// false
```

#### removeAt()
Returns a new array obtained by removing an item at
a specified index.

Usage: `removeAt(array: Array, idx: number): Array`

```js
arr = ['a', 'b', 'c']
arr2 = removeAt(arr, 1)
// [ 'a', 'c' ]
arr2 === arr
// false
```

#### replaceAt()
Returns a new array obtained by replacing an item at
a specified index. If the provided item is the same
(*referentially equal to*) the previous item at that position,
the original array is returned.

Usage: `replaceAt(array: Array, idx: number, newItem: any): Array`

```js
arr = ['a', 'b', 'c']
arr2 = replaceAt(arr, 1, 'd')
// [ 'a', 'd', 'c' ]
arr2 === arr
// false
replaceAt(arr, 1, 'b') === arr
// true
```

### Objects

#### set()
Returns a new object with a modified attribute.
If the provided value is the same (*referentially equal to*)
the previous value, the original object is returned.

Usage: `set(obj: Object, key: string, val: any): Object`

```js
obj = {a: 1, b: 2, c: 3}
obj2 = set(obj, 'b', 5)
// { a: 1, b: 5, c: 3 }
obj2 === obj
// false
set(obj, 'b', 2) === obj
// true
```

#### setIn()
Returns a new object with a modified **nested** attribute.

Usage: `setIn(obj: Object, path: Array<string>, val: any): Object`
If the provided value is the same (*referentially equal to*)
the previous value, the original object is returned.

```js
obj = {a: 1, b: 2, d: {d1: 3, d2: 4}, e: {e1: 'foo', e2: 'bar'}}
obj2 = setIn(obj, ['d', 'd1'], 4)
// { a: 1, b: 2, d: { d1: 4, d2: 4 }, e: { e1: 'foo', e2: 'bar' } }
obj2 === obj
// false
obj2.d === obj.d
// false
obj2.e === obj.e
// true
obj3 = setIn(obj, ['d', 'd1'], 3)
// { a: 1, b: 2, d: { d1: 3, d2: 4 }, e: { e1: 'foo', e2: 'bar' } }
obj3 === obj
// true
obj3.d === obj.d
// true
obj3.e === obj.e
// true
```

#### merge()
Returns a new object built as follows: the overlapping keys from the
second one overwrite the corresponding entries from the first one.
Similar to `Object.assign()`, but immutable.

Usage: `merge(obj1: Object, obj2: Object): Object`

The unmodified `obj1` is returned if `obj2` does not *provide something
new to* `obj1`, i.e. if either of the following
conditions are true:

* `obj2` is `null` or `undefined`
* `obj2` is an object, but it is empty
* All attributes of `obj2` are referentially equal to the
  corresponding attributes of `obj`

#### addDefaults()
Returns a new object built as follows: undefined keys in the first one
are filled in with the corresponding values from the second one.
Similar to underscore's `defaults()` function, but immutable.

Usage: `merge(obj: Object, defaults: Object): Object`


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
