/* eslint-disable global-require, import/no-extraneous-dependencies, import/no-unresolved, max-len */

import test from 'ava';

let timm;
if (process.env.TEST_MINIFIED_LIB) {
  timm = require('../lib/timm.min');
} else {
  timm = require('../lib/timm');
}

const SYMBOL = Symbol('some symbol');

const ARR = [{ a: 1 }, { a: 2 }, { a: 3, d: { d1: 4, d2: 5, d3: null } }];
const OBJ = {
  a: 1,
  b: 2,
  d: { d1: 3, d2: 4, b: { b: { b: 4 } } },
  e: { e1: 'foo', e2: 'bar' },
  arr: ['c', 'd'],
  [SYMBOL]: 'hello world',
};

//------------------------------------------------
// getIn()
//------------------------------------------------
test('getIn: object root: shallow', t => {
  t.is(timm.getIn(OBJ, ['a']), 1);
});

test('getIn: object root: deep', t => {
  t.is(timm.getIn(OBJ, ['d', 'b', 'b', 'b']), 4);
});

test('getIn: object root: with Symbols', t => {
  t.is(timm.getIn(OBJ, [SYMBOL]), 'hello world');
});

test('getIn: array root: shallow', t => {
  t.deepEqual(timm.getIn(ARR, [1]), { a: 2 });
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
  const obj2 = timm.set(OBJ, 'b', 5);
  t.is(OBJ.b, 2);
  t.not(obj2, OBJ);
  t.is(obj2.b, 5);
});

test('set: should support modifing Symbols', t => {
  const obj2 = timm.set(OBJ, SYMBOL, 'new value');
  t.is(obj2[SYMBOL], 'new value');
});

test("set: should return the same object when it hasn't changed", t => {
  const obj2 = timm.set(OBJ, 'b', 2);
  t.is(obj2, OBJ);
});

test('set: should return a new object when the first parameter is null or undefined and the key is a string', t => {
  t.deepEqual(timm.set(null, 'b', 2), { b: 2 });
  t.deepEqual(timm.set(undefined, 'b', 2), { b: 2 });
});

test('set: should return a new array when the first parameter is null or undefined and the key is a number', t => {
  t.deepEqual(timm.set(null, 5, 2), [, , , , , 2]); // eslint-disable-line
  t.deepEqual(timm.set(undefined, 0, 'value'), ['value']);
});

//------------------------------------------------
// setIn()
//------------------------------------------------
test('setIn: level 2: with change', t => {
  const obj2 = timm.setIn(OBJ, ['d', 'd1'], 4);
  t.is(OBJ.d.d1, 3);
  t.not(obj2, OBJ);
  t.not(obj2.d, OBJ.d);
  t.is(obj2.d.d1, 4);
  t.is(obj2.d.b, OBJ.d.b);
  t.is(obj2.e, OBJ.e);
});

test("setIn: level 2: should return the same object when it hasn't changed", t => {
  const obj2 = timm.setIn(OBJ, ['d', 'd1'], 3);
  t.is(OBJ.d.d1, 3);
  t.is(obj2, OBJ);
  t.is(obj2.d, OBJ.d);
  t.is(obj2.d.b, OBJ.d.b);
  t.is(obj2.e, OBJ.e);
});

test('setIn: level 2: should not convert arrays to objects', t => {
  const obj2 = timm.setIn(OBJ, ['arr', 2], 'e');
  t.is(OBJ.arr.length, 2);
  t.not(obj2, OBJ);
  t.true(Array.isArray(obj2.arr));
  t.is(obj2.arr.length, 3);
  t.is(obj2.arr[2], 'e');
});

test('setIn: deeper: with change', t => {
  const obj2 = timm.setIn(OBJ, ['d', 'b', 'b', 'b'], 3);
  t.is(OBJ.d.b.b.b, 4);
  t.is(obj2.d.b.b.b, 3);
  t.not(obj2, OBJ);
  t.not(obj2.d, OBJ.d);
  t.not(obj2.d.b, OBJ.d.b);
  t.not(obj2.d.b.b, OBJ.d.b.b);
  t.is(obj2.e, OBJ.e);
});

test("setIn: deeper: should return the same object when it hasn't changed", t => {
  const obj2 = timm.setIn(OBJ, ['d', 'b', 'b', 'b'], 4);
  t.is(OBJ.d.b.b.b, 4);
  t.is(obj2, OBJ);
  t.is(obj2.d, OBJ.d);
  t.is(obj2.d.b, OBJ.d.b);
  t.is(obj2.d.b.b, OBJ.d.b.b);
  t.is(obj2.e, OBJ.e);
});

test('setIn: should create nested objects for unknown paths', t => {
  const obj2 = timm.setIn(OBJ, ['unknown', 'long', 'path'], 3);
  t.is(obj2.unknown.long.path, 3);
});

test('setIn: should create nested arrays for unknown paths with positive integer segments', t => {
  const obj2 = timm.setIn(OBJ, ['unknown', 0, 'long', 1, 'path'], 'value');
  t.truthy(Array.isArray(obj2.unknown));
  t.truthy(Array.isArray(obj2.unknown[0].long));
  t.is(obj2.unknown[0].long[1].path, 'value');
});

test('setIn: should create nested arrays for undefined objects', t => {
  const obj2 = timm.setIn(undefined, ['unknown', 0, 'path'], 'value');
  t.truthy(Array.isArray(obj2.unknown));
  t.is(obj2.unknown[0].path, 'value');
});

test('setIn: should create nested arrays for unknown paths', t => {
  const obj2 = timm.setIn(OBJ, ['unknown', 0, 1, 'path'], 'value');
  t.truthy(Array.isArray(obj2.unknown));
  t.truthy(Array.isArray(obj2.unknown[0]));
  t.is(obj2.unknown[0][1].path, 'value');
});

test('setIn: should create nested object in arrays for unknown paths', t => {
  const obj2 = timm.setIn(undefined, ['x', 0, 'y', 'z'], 'value');
  t.truthy(Array.isArray(obj2.x));
  t.is(obj2.x[0].y.z, 'value');
});

test('setIn: should create nested arrays for unknown paths with negative segments', t => {
  const obj2 = timm.setIn(OBJ, ['unknown', -17, 'path'], 3);
  t.truthy(Array.isArray(obj2.unknown));
  t.is(obj2.unknown['-17'].path, 3);
});

test('setIn: should create nested arrays for unknown paths with decimal segments', t => {
  const obj2 = timm.setIn(OBJ, ['unknown', 2.2, 'another', -5.3], 'foo');
  t.truthy(Array.isArray(obj2.unknown));
  t.truthy(Array.isArray(obj2.unknown['2.2'].another));
  t.is(obj2.unknown['2.2'].another['-5.3'], 'foo');
});

test('setIn: should return the value if the path is empty', t => {
  const obj2 = timm.setIn(OBJ, [], { a: 3 });
  t.deepEqual(obj2, { a: 3 });
});

test('setIn: should allow unsetting an attribute', t => {
  const obj2 = timm.setIn(OBJ, ['d', 'd1'], undefined);
  t.not(obj2, OBJ);
  t.is(obj2.d.d1, undefined);
});

//------------------------------------------------
// update()
//------------------------------------------------
test('update: with changes', t => {
  const obj2 = timm.update(OBJ, 'b', val => val + 1);
  t.is(OBJ.b, 2);
  t.not(obj2, OBJ);
  t.is(obj2.b, 3);
});

test("update: should return the same object when it hasn't changed", t => {
  const obj2 = timm.update(OBJ, 'b', val => val);
  t.is(obj2, OBJ);
});

test('update: should return a new object when the first parameter is null or undefined and the key is a string', t => {
  t.deepEqual(timm.update(null, 'b', () => 2), { b: 2 });
  t.deepEqual(timm.update(undefined, 'b', () => 2), { b: 2 });
});

test('update: should return a new array when the first parameter is null or undefined and the key is a number', t => {
  t.deepEqual(timm.update(null, 5, () => 2), [, , , , , 2]); // eslint-disable-line
  t.deepEqual(timm.update(undefined, 0, () => 'value'), ['value']);
});

//------------------------------------------------
// updateIn()
//------------------------------------------------
test('updateIn: with changes', t => {
  const obj2 = timm.updateIn(OBJ, ['e', 'e1'], val => `${val}x`);
  t.is(OBJ.e.e1, 'foo');
  t.not(obj2, OBJ);
  t.is(obj2.e.e1, 'foox');
  t.is(obj2.d, OBJ.d);
});

test("updateIn: should return the same object when it hasn't changed", t => {
  const obj2 = timm.updateIn(OBJ, ['e', 'e1'], val => val);
  t.is(obj2, OBJ);
});

test('updateIn: should create nested objects for unknown paths', t => {
  const obj2 = timm.updateIn(OBJ, ['unknown', 'long', 'path'], () => 3);
  t.is(obj2.unknown.long.path, 3);
});

//------------------------------------------------
// merge()
//------------------------------------------------
test('merge: with changes', t => {
  const obj2 = timm.merge(OBJ, { b: 4, c: 3 });
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
  const obj2 = timm.merge(
    { a: 1 },
    { b: 2 },
    { c: 3 },
    { d: 4 },
    { e: 5 },
    { f: 6 },
    { g: 7 }
  );
  t.deepEqual(obj2, { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 });
});

test('merge: should return the same object when merged with undefined', t => {
  const obj2 = timm.merge(OBJ, undefined);
  t.is(obj2, OBJ);
});

test('merge: should ignore undefined attributes in subsequent args', t => {
  const obj2 = timm.merge(OBJ, { a: undefined });
  t.is(obj2, OBJ);
  t.is(OBJ.a, 1);
});

test('merge: should NOT ignore null attributes in subsequent args', t => {
  const obj2 = timm.merge(OBJ, { g: null });
  t.not(obj2, OBJ);
  t.is(obj2.g, null);
});

test('merge: should return the same object when merged with null', t => {
  const obj2 = timm.merge(OBJ, null);
  t.is(obj2, OBJ);
});

test('merge: should return the same object when merged with an empty object', t => {
  const obj2 = timm.merge(OBJ, {});
  t.is(obj2, OBJ);
});

test("merge: should return the same object when it hasn't changed", t => {
  const obj2 = timm.merge(OBJ, { b: 2, d: OBJ.d });
  t.is(obj2, OBJ);
});

test('merge: should throw with no args', t => {
  t.throws(timm.merge);
});

test('merge: multiple: with changes', t => {
  const obj2 = timm.merge(OBJ, { b: 4 }, { c: 3 }, { b: 7 });
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
  const obj2 = timm.merge(OBJ, undefined, null, {}, null, undefined);
  t.is(obj2, OBJ);
});

test("merge: multiple: should return the same object when it hasn't changed", t => {
  const obj2 = timm.merge(OBJ, { b: 2 }, { d: OBJ.d }, { c: undefined });
  t.is(obj2, OBJ);
});

//------------------------------------------------
// mergeDeep()
//------------------------------------------------
test('mergeDeep: should merge deeply', t => {
  const obj1 = { a: 1, b: { a: 1, b: 2, obj: { foo: 3 } }, c: { c1: 8 } };
  const obj2 = timm.mergeDeep(obj1, { b: { b: 3 } });
  t.deepEqual(obj2, { a: 1, b: { a: 1, b: 3, obj: { foo: 3 } }, c: { c1: 8 } });
  t.is(obj1.b.obj, obj2.b.obj); // unaltered branch
  t.is(obj1.c, obj2.c); // unaltered branch
});

test('mergeDeep: multiple: should merge deeply', t => {
  const obj2 = timm.mergeDeep(
    { a: 1, b: { a: 1, b: 1 } },
    { b: { b: 2, c: 2 } },
    { a: 3, b: { c: 3 } }
  );
  t.deepEqual(obj2, { a: 3, b: { a: 1, b: 2, c: 3 } });
});

test("mergeDeep: should return the same object when it hasn't changed", t => {
  const obj1 = { a: 1, b: { a: 1, b: 2 } };
  const obj2 = timm.mergeDeep(obj1, { a: 1, b: {} }, { a: 1, b: obj1.b });
  t.is(obj1, obj2);
});

test("mergeDeep: multiple: should return the same object when it hasn't changed", t => {
  const obj2 = timm.mergeDeep(
    OBJ,
    { b: 2 },
    { d: { b: OBJ.d.b } },
    { c: undefined }
  );
  t.is(obj2, OBJ);
});

test('mergeDeep: with more than 6 args', t => {
  const obj2 = timm.mergeDeep(
    { a: 1 },
    { b: { a: 1 } },
    { c: 3 },
    { d: 4 },
    { e: 5 },
    { f: 6 },
    { b: { b: 2 } }
  );
  t.deepEqual(obj2, { a: 1, b: { a: 1, b: 2 }, c: 3, d: 4, e: 5, f: 6 });
});

test('merge: should preserve unmodified Symbols', t => {
  const obj2 = timm.merge(OBJ, { foo: 'bar' });
  t.is(obj2[SYMBOL], OBJ[SYMBOL]);
});

test('merge: should allow updating Symbol properties', t => {
  const obj2 = timm.merge(OBJ, { [SYMBOL]: 'bar' });
  t.is(obj2[SYMBOL], 'bar');
});

//------------------------------------------------
// mergeIn()
//------------------------------------------------
test('mergeIn: with changes', t => {
  const obj2 = timm.mergeIn(OBJ, ['d', 'b', 'b'], { a: 3, c: 5 });
  t.deepEqual(OBJ.d.b.b, { b: 4 });
  t.not(obj2, OBJ);
  t.deepEqual(obj2.d.b.b, { a: 3, b: 4, c: 5 });
  t.is(obj2.e, OBJ.e);
});

test('mergeIn: should create nested objects for unknown paths', t => {
  const obj2 = timm.mergeIn(OBJ, ['unknown', 'path'], { d: 4 });
  t.deepEqual(obj2.unknown.path, { d: 4 });
});

test('mergeIn: with more than 7 args', t => {
  const obj2 = timm.mergeIn(
    { a: 1 },
    [],
    { b: 2 },
    { c: 3 },
    { d: 4 },
    { e: 5 },
    { f: 6 },
    { g: 7 }
  );
  t.deepEqual(obj2, { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 });
});

//------------------------------------------------
// omit()
//------------------------------------------------
test('omit: with changes (single attribute)', t => {
  const obj2 = timm.omit(OBJ, 'a');
  t.is(obj2.a, undefined);
  t.is(obj2.b, 2);
  t.is(obj2[SYMBOL], 'hello world'),
  t.not(obj2, OBJ);
  t.deepEqual(obj2.d, OBJ.d);
});

test('omit: with changes (multiple attributes)', t => {
  const obj2 = timm.omit(OBJ, ['a', 'b']);
  t.is(obj2.a, undefined);
  t.is(obj2.b, undefined);
  t.not(obj2, OBJ);
  t.deepEqual(obj2.d, OBJ.d);
});

test("omit: should return the same object when it hasn't changed", t => {
  const obj2 = timm.omit(OBJ, 'z');
  t.deepEqual(obj2, OBJ);
});

test('omit: should support omitting Symbols', t => {
  const obj2 = timm.omit(OBJ, SYMBOL);
  t.is(obj2[SYMBOL], undefined);
});

//------------------------------------------------
// addDefaults()
//------------------------------------------------
test('addDefaults: with changes', t => {
  const obj2 = timm.addDefaults(OBJ, { b: 4, c: 3 });
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
  const obj2 = timm.addDefaults(OBJ, { f: null });
  t.not(obj2, OBJ);
  t.is(obj2.f, null);
});

test('addDefaults: with more than 6 args', t => {
  const obj2 = timm.addDefaults(
    { a: 1 },
    { b: 2 },
    { c: 3 },
    { d: 4 },
    { e: 5 },
    { f: 6 },
    { g: 7 }
  );
  t.deepEqual(obj2, { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 });
});

test('addDefaults: should return the same object when combined with undefined', t => {
  const obj2 = timm.addDefaults(OBJ, undefined);
  t.is(obj2, OBJ);
});

test('addDefaults: should return the same object when combined with null', t => {
  const obj2 = timm.addDefaults(OBJ, null);
  t.is(obj2, OBJ);
});

test('addDefaults: should return the same object when combined with an empty object', t => {
  const obj2 = timm.addDefaults(OBJ, {});
  t.is(obj2, OBJ);
});

test("addDefaults: should return the same object when it hasn't changed", t => {
  const obj2 = timm.addDefaults(OBJ, { b: 2, d: OBJ.d });
  t.is(obj2, OBJ);
});

test('addDefaults: multiple: with changes', t => {
  const obj2 = timm.addDefaults(OBJ, { b: 4 }, { c: 3 }, { b: 7 }, { c: 6 });
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
  const obj2 = timm.addDefaults(OBJ, undefined, null, {}, null, undefined);
  t.is(obj2, OBJ);
});

test("addDefaults: multiple: should return the same object when it hasn't changed", t => {
  const obj2 = timm.addDefaults(OBJ, { b: 2 }, { d: OBJ.d }, { c: undefined });
  t.is(obj2, OBJ);
});
