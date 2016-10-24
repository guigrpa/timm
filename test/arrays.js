/* eslint-disable global-require, import/no-extraneous-dependencies, import/no-unresolved */

import test from 'ava';

let timm;
if (process.env.TEST_MINIFIED_LIB) {
  timm = require('../lib/timm.min');
} else {
  timm = require('../lib/timm');
}

const ARR0 = ['a', 'b', 'c'];
const ARR  = ['a', 'b', 'c'];

//------------------------------------------------
// addLast()
//------------------------------------------------
test('addLast: single value', (t) => {
  const arr2 = timm.addLast(ARR, 'd');
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['a', 'b', 'c', 'd']);
});

test('addLast: multiple values', (t) => {
  const arr2 = timm.addLast(ARR, ['d', 'e']);
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['a', 'b', 'c', 'd', 'e']);
});

//------------------------------------------------
// addFirst()
//------------------------------------------------
test('addFirst: single value', (t) => {
  const arr2 = timm.addFirst(ARR, 'd');
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['d', 'a', 'b', 'c']);
});

test('addFirst: multiple values', (t) => {
  const arr2 = timm.addFirst(ARR, ['d', 'e']);
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['d', 'e', 'a', 'b', 'c']);
});

//------------------------------------------------
// removeLast()
//------------------------------------------------
test('removeLast: changing', (t) => {
  const arr2 = timm.removeLast(ARR);
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['a', 'b']);
});

test('removeLast: should return the same array when it hasn\'t changed', (t) => {
  const arr = [];
  const arr2 = timm.removeLast(arr);
  t.deepEqual(arr2, arr);
});

//------------------------------------------------
// removeLast()
//------------------------------------------------
test('removeFirst: changing', (t) => {
  const arr2 = timm.removeFirst(ARR);
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['b', 'c']);
});

test('removeFirst: should return the same array when it hasn\'t changed', (t) => {
  const arr = [];
  const arr2 = timm.removeFirst(arr);
  t.deepEqual(arr2, arr);
});

//------------------------------------------------
// insert()
//------------------------------------------------
test('insert: single value', (t) => {
  const arr2 = timm.insert(ARR, 1, 'e');
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['a', 'e', 'b', 'c']);
});

test('insert: multiple values', (t) => {
  const arr2 = timm.insert(ARR, 1, ['e', 'f']);
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['a', 'e', 'f', 'b', 'c']);
});

//------------------------------------------------
// removeAt()
//------------------------------------------------
test('removeAt', (t) => {
  const arr2 = timm.removeAt(ARR, 1);
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['a', 'c']);
});

test('removeAt', (t) => {
  const arr2 = timm.removeAt(ARR, 5);
  t.deepEqual(ARR, ARR0);
  t.is(arr2, ARR);
});

//------------------------------------------------
// replaceAt()
//------------------------------------------------
test('replaceAt: changing', (t) => {
  const arr2 = timm.replaceAt(ARR, 1, 'd');
  t.deepEqual(ARR, ARR0);
  t.not(arr2, ARR);
  t.deepEqual(arr2, ['a', 'd', 'c']);
});

test('replaceAt: should return the same object when it hasn\'t changed', (t) => {
  const arr2 = timm.replaceAt(ARR, 1, 'b');
  t.is(arr2, ARR);
});
