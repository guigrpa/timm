import test from 'ava';
if (process.env.TEST_MINIFIED_LIB) {
  var timm = require('../lib/timm.min');
} else {
  var timm = require('../lib/timm');
}

var ARR0 = [{a: 1}, {a: 2}, {a: 3, d: {d1: 4, d2: 5, d3: null}}];
var ARR  = [{a: 1}, {a: 2}, {a: 3, d: {d1: 4, d2: 5, d3: null}}];
var OBJ0 = {a: 1, b: 2, d: {d1: 3, d2: 4, b: {b: {b: 4}}}, e: {e1: 'foo', e2: 'bar'}, arr: ['c', 'd']};
var OBJ  = {a: 1, b: 2, d: {d1: 3, d2: 4, b: {b: {b: 4}}}, e: {e1: 'foo', e2: 'bar'}, arr: ['c', 'd']};

//------------------------------------------------
// getIn()
//------------------------------------------------
test('getIn: object root: shallow', t => {
  t.is(timm.getIn(OBJ, ['a']), 1);
});

test('getIn: object root: deep', t => {
  t.is(timm.getIn(OBJ, ['d', 'b', 'b', 'b']), 4);
});

test('getIn: array root: shallow', t => {
  t.same(timm.getIn(ARR, [1]), {a: 2});
});

test('getIn: array root: deep', t => {
  t.is(timm.getIn(ARR, [2, 'd', 'd2']), 5);
});

test('getIn: array root: deep - null value', t => {
  t.is(timm.getIn(ARR, [2, 'd', 'd3']), null);
});

test('getIn: should return the object for an empty array', t => {
  t.is(timm.getIn(ARR, []), ARR);
  t.is(timm.getIn(OBJ, []), OBJ);
});

test('getIn: should return undefined for an unknown path', t => {
  t.is(timm.getIn(OBJ, ['d', 'j']), undefined);
  t.is(timm.getIn(ARR, [23]), undefined);
});

test('getIn: should return undefined for a null/undefined object', t => {
  t.is(timm.getIn(null, ['a']), undefined);
  t.is(timm.getIn(undefined, ['a']), undefined);
});

test('getIn: should throw for an unspecified path', t => {
  t.throws(() => timm.getIn(OBJ));
});

//------------------------------------------------
// set()
//------------------------------------------------
test('set: changing', t => {
  var obj2 = timm.set(OBJ, 'b', 5);
  t.is(OBJ.b, 2);
  t.not(obj2, OBJ);
  t.is(obj2.b, 5);
});

test('set: should return the same object when it hasn\'t changed', t => {
  var obj2 = timm.set(OBJ, 'b', 2);
  t.is(obj2, OBJ);
});

//------------------------------------------------
// setIn()
//------------------------------------------------
test('setIn: level 2: with change', t => {
  var obj2 = timm.setIn(OBJ, ['d', 'd1'], 4);
  t.is(OBJ.d.d1, 3);
  t.not(obj2, OBJ);
  t.not(obj2.d, OBJ.d);
  t.is(obj2.d.d1, 4);
  t.is(obj2.d.b, OBJ.d.b);
  t.is(obj2.e, OBJ.e);
});

test('setIn: level 2: should return the same object when it hasn\'t changed', t => {
  var obj2 = timm.setIn(OBJ, ['d', 'd1'], 3);
  t.is(OBJ.d.d1, 3);
  t.is(obj2, OBJ);
  t.is(obj2.d, OBJ.d);
  t.is(obj2.d.b, OBJ.d.b);
  t.is(obj2.e, OBJ.e);
});

test('setIn: level 2: should not convert arrays to objects', t => {
  var obj2 = timm.setIn(OBJ, ['arr', 2], 'e');
  t.is(OBJ.arr.length, 2);
  t.not(obj2, OBJ);
  t.true(Array.isArray(obj2.arr));
  t.is(obj2.arr.length, 3);
  t.is(obj2.arr[2], 'e');
});

test('setIn: deeper: with change', t => {
  var obj2 = timm.setIn(OBJ, ['d', 'b', 'b', 'b'], 3);
  t.is(OBJ.d.b.b.b, 4);
  t.is(obj2.d.b.b.b, 3);
  t.not(obj2, OBJ);
  t.not(obj2.d, OBJ.d);
  t.not(obj2.d.b, OBJ.d.b);
  t.not(obj2.d.b.b, OBJ.d.b.b);
  t.is(obj2.e, OBJ.e);
});

test('setIn: deeper: should return the same object when it hasn\'t changed', t => {
  var obj2 = timm.setIn(OBJ, ['d', 'b', 'b', 'b'], 4);
  t.is(OBJ.d.b.b.b, 4);
  t.is(obj2, OBJ);
  t.is(obj2.d, OBJ.d);
  t.is(obj2.d.b, OBJ.d.b);
  t.is(obj2.d.b.b, OBJ.d.b.b);
  t.is(obj2.e, OBJ.e);
});

test('setIn: should create nested objects for unknown paths', t => {
  var obj2 = timm.setIn(OBJ, ['unknown', 'long', 'path'], 3);
  t.is(obj2.unknown.long.path, 3);
});

test('setIn: should return the value if the path is empty', t => {
  var obj2 = timm.setIn(OBJ, [], {a: 3});
  t.same(obj2, {a: 3});
});

test('setIn: should allow unsetting an attribute', t => {
  var obj2 = timm.setIn(OBJ, ['d', 'd1'], undefined);
  t.not(obj2, OBJ);
  t.is(obj2.d.d1, undefined);
});

//------------------------------------------------
// updateIn()
//------------------------------------------------
test('updateIn: with changes', t => {
  var obj2 = timm.updateIn(OBJ, ['e', 'e1'], val => val + 'x');
  t.is(OBJ.e.e1, 'foo');
  t.not(obj2, OBJ);
  t.is(obj2.e.e1, 'foox');
  t.is(obj2.d, OBJ.d);
});

test('updateIn: should return the same object when it hasn\'t changed', t => {
  var obj2 = timm.updateIn(OBJ, ['e', 'e1'], val => val);
  t.is(obj2, OBJ);
});

test('updateIn: should create nested objects for unknown paths', t => {
  var obj2 = timm.updateIn(OBJ, ['unknown', 'long', 'path'], val => 3);
  t.is(obj2.unknown.long.path, 3);
});

//------------------------------------------------
// merge()
//------------------------------------------------
test('merge: with changes', t => {
  var obj2 = timm.merge(OBJ, {b: 4, c: 3});
  t.is(OBJ.b, 2);
  t.is(OBJ.c, undefined);
  t.not(obj2, OBJ);
  t.is(obj2.a, OBJ.a);
  t.is(obj2.b, 4);
  t.is(obj2.c, 3);
  t.is(obj2.d, OBJ.d);
  t.is(obj2.e, OBJ.e);
});

test('merge: with more than 6 args', t => {
  var obj2 = timm.merge({a: 1}, {b: 2}, {c: 3}, {d: 4}, {e: 5}, {f: 6}, {g: 7});
  t.same(obj2, {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7});
});

test('merge: should return the same object when merged with undefined', t => {
  var obj2 = timm.merge(OBJ, undefined);
  t.is(obj2, OBJ);
});

test('merge: should ignore undefined attributes in subsequent args', t => {
  var obj2 = timm.merge(OBJ, {a: undefined});
  t.is(obj2, OBJ);
  t.is(OBJ.a, 1);
});

test('merge: should NOT ignore null attributes in subsequent args', t => {
  var obj2 = timm.merge(OBJ, {g: null});
  t.not(obj2, OBJ);
  t.is(obj2.g, null);
});

test('merge: should return the same object when merged with null', t => {
  var obj2 = timm.merge(OBJ, null);
  t.is(obj2, OBJ);
});

test('merge: should return the same object when merged with an empty object', t => {
  var obj2 = timm.merge(OBJ, {});
  t.is(obj2, OBJ);
});

test('merge: should return the same object when it hasn\'t changed', t => {
  var obj2 = timm.merge(OBJ, {b: 2, d: OBJ.d});
  t.is(obj2, OBJ);
});

test('merge: should throw with no args', t => {
  t.throws(timm.merge);
});

test('merge: multiple: with changes', t => {
  var obj2 = timm.merge(OBJ, {b: 4}, {c: 3}, {b: 7});
  t.is(OBJ.b, 2);
  t.is(OBJ.c, undefined);
  t.not(obj2, OBJ);
  t.is(obj2.a, OBJ.a);
  t.is(obj2.b, 7);
  t.is(obj2.c, 3);
  t.is(obj2.d, OBJ.d);
  t.is(obj2.e, OBJ.e);
});

test('merge: multiple: should return the same object when merged with undefined, null and empty objects', t => {
  var obj2 = timm.merge(OBJ, undefined, null, {}, null, undefined);
  t.is(obj2, OBJ);
});

test('merge: multiple: should return the same object when it hasn\'t changed', t => {
  var obj2 = timm.merge(OBJ, {b: 2}, {d: OBJ.d}, {c: undefined});
  t.is(obj2, OBJ);
});

//------------------------------------------------
// mergeIn()
//------------------------------------------------
test('mergeIn: with changes', t => {
  var obj2 = timm.mergeIn(OBJ, ['d', 'b', 'b'], {a: 3, c: 5});
  t.same(OBJ.d.b.b, {b: 4});
  t.not(obj2, OBJ);
  t.same(obj2.d.b.b, {a: 3, b: 4, c: 5});
  t.is(obj2.e, OBJ.e);
});

test('mergeIn: should create nested objects for unknown paths', t => {
  var obj2 = timm.mergeIn(OBJ, ['unknown', 'path'], {d: 4});
  t.same(obj2.unknown.path, {d: 4});
});

test('mergeIn: with more than 7 args', t => {
  var obj2 = timm.mergeIn({a: 1}, [], {b: 2}, {c: 3}, {d: 4}, {e: 5}, {f: 6}, {g: 7});
  t.same(obj2, {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7});
});

//------------------------------------------------
// addDefaults()
//------------------------------------------------
test('addDefaults: with changes', t => {
  var obj2 = timm.addDefaults(OBJ, {b: 4, c: 3});
  t.is(OBJ.b, 2);
  t.is(OBJ.c, undefined);
  t.not(obj2, OBJ);
  t.is(obj2.a, OBJ.a);
  t.is(obj2.b, OBJ.b);
  t.is(obj2.c, 3);
  t.is(obj2.d, OBJ.d);
  t.is(obj2.e, OBJ.e);
});

test('addDefaults: with changes (null attribute)', t => {
  var obj2 = timm.addDefaults(OBJ, {f: null});
  t.not(obj2, OBJ);
  t.is(obj2.f, null);
});

test('addDefaults: with more than 6 args', t => {
  var obj2 = timm.addDefaults({a: 1}, {b: 2}, {c: 3}, {d: 4}, {e: 5}, {f: 6}, {g: 7});
  t.same(obj2, {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7});
});

test('addDefaults: should return the same object when combined with undefined', t => {
  var obj2 = timm.addDefaults(OBJ, undefined);
  t.is(obj2, OBJ);
});

test('addDefaults: should return the same object when combined with null', t => {
  var obj2 = timm.addDefaults(OBJ, null);
  t.is(obj2, OBJ);
});

test('addDefaults: should return the same object when combined with an empty object', t => {
  var obj2 = timm.addDefaults(OBJ, {});
  t.is(obj2, OBJ);
});

test('addDefaults: should return the same object when it hasn\'t changed', t => {
  var obj2 = timm.addDefaults(OBJ, {b: 2, d: OBJ. d});
  t.is(obj2, OBJ);
});

test('addDefaults: multiple: with changes', t => {
  var obj2 = timm.addDefaults(OBJ, {b: 4}, {c: 3}, {b: 7}, {c: 6});
  t.is(OBJ.b, 2);
  t.is(OBJ.c, undefined);
  t.not(obj2, OBJ);
  t.is(obj2.a, OBJ.a);
  t.is(obj2.b, OBJ.b);
  t.is(obj2.c, 3);
  t.is(obj2.d, OBJ.d);
  t.is(obj2.e, OBJ.e);
});

test('addDefaults: multiple: should return the same object when combined with undefined, null and empty objects', t => {
  var obj2 = timm.addDefaults(OBJ, undefined, null, {}, null, undefined);
  t.is(obj2, OBJ);
});

test('addDefaults: multiple: should return the same object when it hasn\'t changed', t => {
  var obj2 = timm.addDefaults(OBJ, {b: 2}, {d: OBJ.d}, {c: undefined});
  t.is(obj2, OBJ);
});
