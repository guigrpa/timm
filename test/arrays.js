import test from 'ava';
if (process.env.TEST_MINIFIED_LIB) {
  var timm = require('../dist/timm.min');
} else {
  var timm = require('../dist/timm');
}

var ARR0 = ['a', 'b', 'c'];
var ARR  = ['a', 'b', 'c'];

//------------------------------------------------
// addLast()
//------------------------------------------------
test('addLast: single value', t => {
  var arr2 = timm.addLast(ARR, 'd');
  t.same(ARR, ARR0);
  t.not(arr2, ARR);
  t.same(arr2, ['a', 'b', 'c', 'd']);
});

test('addLast: multiple values', t => {
  var arr2 = timm.addLast(ARR, ['d', 'e']);
  t.same(ARR, ARR0);
  t.not(arr2, ARR);
  t.same(arr2, ['a', 'b', 'c', 'd', 'e']);
});

//------------------------------------------------
// addFirst()
//------------------------------------------------
test('addFirst: single value', t => {
  var arr2 = timm.addFirst(ARR, 'd');
  t.same(ARR, ARR0);
  t.not(arr2, ARR);
  t.same(arr2, ['d', 'a', 'b', 'c']);
});

test('addFirst: multiple values', t => {
  var arr2 = timm.addFirst(ARR, ['d', 'e']);
  t.same(ARR, ARR0);
  t.not(arr2, ARR);
  t.same(arr2, ['d', 'e', 'a', 'b', 'c']);
});

//------------------------------------------------
// insert()
//------------------------------------------------
test('insert: single value', t => {
  var arr2 = timm.insert(ARR, 1, 'e');
  t.same(ARR, ARR0);
  t.not(arr2, ARR);
  t.same(arr2, ['a', 'e', 'b', 'c']);
});

test('insert: multiple values', t => {
  var arr2 = timm.insert(ARR, 1, ['e', 'f']);
  t.same(ARR, ARR0);
  t.not(arr2, ARR);
  t.same(arr2, ['a', 'e', 'f', 'b', 'c']);
});

//------------------------------------------------
// removeAt()
//------------------------------------------------
test('removeAt', t => {
  var arr2 = timm.removeAt(ARR, 1);
  t.same(ARR, ARR0);
  t.not(arr2, ARR);
  t.same(arr2, ['a', 'c']);
});

//------------------------------------------------
// replaceAt()
//------------------------------------------------
test('replaceAt: changing', t => {
  var arr2 = timm.replaceAt(ARR, 1, 'd');
  t.same(ARR, ARR0);
  t.not(arr2, ARR);
  t.same(arr2, ['a', 'd', 'c']);
});

test('replaceAt: should return the same object when it hasn\'t changed', t => {
  var arr2 = timm.replaceAt(ARR, 1, 'b');
  t.is(arr2, ARR);
});
