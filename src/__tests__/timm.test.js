import * as timm from '../timm';

const ARR0 = ['a', 'b', 'c'];
const ARR = ['a', 'b', 'c'];

const SYMBOL = Symbol('some symbol');
const ARR2 = [{ a: 1 }, { a: 2 }, { a: 3, d: { d1: 4, d2: 5, d3: null } }];
const OBJ = {
  a: 1,
  b: 2,
  d: { d1: 3, d2: 4, b: { b: { b: 4 } } },
  e: { e1: 'foo', e2: 'bar' },
  arr: ['c', 'd'],
  [SYMBOL]: 'hello world',
};

// ------------------------------------------------
// addLast()
// ------------------------------------------------
it('addLast: single value', () => {
  const arr2 = timm.addLast(ARR, 'd');
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['a', 'b', 'c', 'd']);
});

it('addLast: multiple values', () => {
  const arr2 = timm.addLast(ARR, ['d', 'e']);
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['a', 'b', 'c', 'd', 'e']);
});

// ------------------------------------------------
// addFirst()
// ------------------------------------------------
it('addFirst: single value', () => {
  const arr2 = timm.addFirst(ARR, 'd');
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['d', 'a', 'b', 'c']);
});

it('addFirst: multiple values', () => {
  const arr2 = timm.addFirst(ARR, ['d', 'e']);
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['d', 'e', 'a', 'b', 'c']);
});

// ------------------------------------------------
// removeLast()
// ------------------------------------------------
it('removeLast: changing', () => {
  const arr2 = timm.removeLast(ARR);
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['a', 'b']);
});

it("removeLast: should return the same array when it hasn't changed", () => {
  const arr = [];
  const arr2 = timm.removeLast(arr);
  expect(arr2).toEqual(arr);
});

// ------------------------------------------------
// removeLast()
// ------------------------------------------------
it('removeFirst: changing', () => {
  const arr2 = timm.removeFirst(ARR);
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['b', 'c']);
});

it("removeFirst: should return the same array when it hasn't changed", () => {
  const arr = [];
  const arr2 = timm.removeFirst(arr);
  expect(arr2).toEqual(arr);
});

// ------------------------------------------------
// insert()
// ------------------------------------------------
it('insert: single value', () => {
  const arr2 = timm.insert(ARR, 1, 'e');
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['a', 'e', 'b', 'c']);
});

it('insert: multiple values', () => {
  const arr2 = timm.insert(ARR, 1, ['e', 'f']);
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['a', 'e', 'f', 'b', 'c']);
});

// ------------------------------------------------
// removeAt()
// ------------------------------------------------
it('removeAt', () => {
  const arr2 = timm.removeAt(ARR, 1);
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['a', 'c']);
});

it('removeAt 2', () => {
  const arr2 = timm.removeAt(ARR, 5);
  expect(ARR).toEqual(ARR0);
  expect(arr2).toBe(ARR);
});

// ------------------------------------------------
// replaceAt()
// ------------------------------------------------
it('replaceAt: changing', () => {
  const arr2 = timm.replaceAt(ARR, 1, 'd');
  expect(ARR).toEqual(ARR0);
  expect(arr2).not.toBe(ARR);
  expect(arr2).toEqual(['a', 'd', 'c']);
});

it("replaceAt: should return the same object when it hasn't changed", () => {
  const arr2 = timm.replaceAt(ARR, 1, 'b');
  expect(arr2).toBe(ARR);
});

// ------------------------------------------------
// getIn()
// ------------------------------------------------
it('getIn: object root: shallow', () => {
  expect(timm.getIn(OBJ, ['a'])).toBe(1);
});

it('getIn: object root: deep', () => {
  expect(timm.getIn(OBJ, ['d', 'b', 'b', 'b'])).toBe(4);
});

it('getIn: object root: with Symbols', () => {
  expect(timm.getIn(OBJ, [SYMBOL])).toBe('hello world');
});

it('getIn: array root: shallow', () => {
  expect(timm.getIn(ARR2, [1])).toEqual({ a: 2 });
});

it('getIn: array root: deep', () => {
  expect(timm.getIn(ARR2, [2, 'd', 'd2'])).toBe(5);
});

it('getIn: array root: deep - null value', () => {
  expect(timm.getIn(ARR2, [2, 'd', 'd3'])).toBe(null);
});

it('getIn: should return the object for an empty array', () => {
  expect(timm.getIn(ARR2, [])).toBe(ARR2);
  expect(timm.getIn(OBJ, [])).toBe(OBJ);
});

it('getIn: should return undefined for an unknown path', () => {
  expect(timm.getIn(OBJ, ['d', 'j'])).toBeUndefined();
  expect(timm.getIn(ARR2, [23])).toBeUndefined();
});

it('getIn: should return undefined for a null/undefined object', () => {
  expect(timm.getIn(null, ['a'])).toBeUndefined();
  expect(timm.getIn(undefined, ['a'])).toBeUndefined();
});

it('getIn: should throw for an unspecified path', () => {
  expect(() => timm.getIn(OBJ)).toThrow();
});

// ------------------------------------------------
// set()
// ------------------------------------------------
it('set: changing', () => {
  const obj2 = timm.set(OBJ, 'b', 5);
  expect(OBJ.b).toBe(2);
  expect(obj2).not.toBe(OBJ);
  expect(obj2.b).toBe(5);
});

it('set: should support modifing Symbols', () => {
  const obj2 = timm.set(OBJ, SYMBOL, 'new value');
  expect(obj2[SYMBOL]).toBe('new value');
});

it("set: should return the same object when it hasn't changed", () => {
  const obj2 = timm.set(OBJ, 'b', 2);
  expect(obj2).toBe(OBJ);
});

it("set: should return the same object when it hasn't changed (symbol)", () => {
  const obj2 = timm.set(OBJ, SYMBOL, 'hello world');
  expect(obj2).toBe(OBJ);
});

it('set: should return a new object when the first parameter is null or undefined and the key is a string', () => {
  expect(timm.set(null, 'b', 2)).toEqual({ b: 2 });
  expect(timm.set(undefined, 'b', 2)).toEqual({ b: 2 });
});

it('set: should return a new array when the first parameter is null or undefined and the key is a number', () => {
  expect(timm.set(null, 5, 2)).toEqual([, , , , , 2]); // eslint-disable-line
  expect(timm.set(undefined, 0, 'value')).toEqual(['value']);
});

// ------------------------------------------------
// setIn()
// ------------------------------------------------
it('setIn: level 2: with change', () => {
  const obj2 = timm.setIn(OBJ, ['d', 'd1'], 4);
  expect(OBJ.d.d1).toBe(3);
  expect(obj2).not.toBe(OBJ);
  expect(obj2.d).not.toBe(OBJ.d);
  expect(obj2.d.d1).toBe(4);
  expect(obj2.d.b).toBe(OBJ.d.b);
  expect(obj2.e).toBe(OBJ.e);
});

it("setIn: level 2: should return the same object when it hasn't changed", () => {
  const obj2 = timm.setIn(OBJ, ['d', 'd1'], 3);
  expect(OBJ.d.d1).toBe(3);
  expect(obj2).toBe(OBJ);
  expect(obj2.d).toBe(OBJ.d);
  expect(obj2.d.b).toBe(OBJ.d.b);
  expect(obj2.e).toBe(OBJ.e);
});

it('setIn: level 2: should not convert arrays to objects', () => {
  const obj2 = timm.setIn(OBJ, ['arr', 2], 'e');
  expect(OBJ.arr.length).toBe(2);
  expect(obj2).not.toBe(OBJ);
  expect(Array.isArray(obj2.arr)).toBeTruthy();
  expect(obj2.arr.length).toBe(3);
  expect(obj2.arr[2]).toBe('e');
});

it('setIn: deeper: with change', () => {
  const obj2 = timm.setIn(OBJ, ['d', 'b', 'b', 'b'], 3);
  expect(OBJ.d.b.b.b).toBe(4);
  expect(obj2.d.b.b.b).toBe(3);
  expect(obj2).not.toBe(OBJ);
  expect(obj2.d).not.toBe(OBJ.d);
  expect(obj2.d.b).not.toBe(OBJ.d.b);
  expect(obj2.d.b.b).not.toBe(OBJ.d.b.b);
  expect(obj2.e).toBe(OBJ.e);
});

it("setIn: deeper: should return the same object when it hasn't changed", () => {
  const obj2 = timm.setIn(OBJ, ['d', 'b', 'b', 'b'], 4);
  expect(OBJ.d.b.b.b).toBe(4);
  expect(obj2).toBe(OBJ);
  expect(obj2.d).toBe(OBJ.d);
  expect(obj2.d.b).toBe(OBJ.d.b);
  expect(obj2.d.b.b).toBe(OBJ.d.b.b);
  expect(obj2.e).toBe(OBJ.e);
});

it('setIn: should create nested objects for unknown paths', () => {
  const obj2 = timm.setIn(OBJ, ['unknown', 'long', 'path'], 3);
  expect(obj2.unknown.long.path).toBe(3);
});

it('setIn: should create nested arrays for unknown paths with positive integer segments', () => {
  const obj2 = timm.setIn(OBJ, ['unknown', 0, 'long', 1, 'path'], 'value');
  expect(Array.isArray(obj2.unknown)).toBeTruthy();
  expect(Array.isArray(obj2.unknown[0].long)).toBeTruthy();
  expect(obj2.unknown[0].long[1].path).toBe('value');
});

it('setIn: should create nested arrays for undefined objects', () => {
  const obj2 = timm.setIn(undefined, ['unknown', 0, 'path'], 'value');
  expect(Array.isArray(obj2.unknown)).toBeTruthy();
  expect(obj2.unknown[0].path).toBe('value');
});

it('setIn: should create nested arrays for unknown paths', () => {
  const obj2 = timm.setIn(OBJ, ['unknown', 0, 1, 'path'], 'value');
  expect(Array.isArray(obj2.unknown)).toBeTruthy();
  expect(Array.isArray(obj2.unknown[0])).toBeTruthy();
  expect(obj2.unknown[0][1].path).toBe('value');
});

it('setIn: should create nested object in arrays for unknown paths', () => {
  const obj2 = timm.setIn(undefined, ['x', 0, 'y', 'z'], 'value');
  expect(Array.isArray(obj2.x)).toBeTruthy();
  expect(obj2.x[0].y.z).toBe('value');
});

it('setIn: should create nested arrays for unknown paths with negative segments', () => {
  const obj2 = timm.setIn(OBJ, ['unknown', -17, 'path'], 3);
  expect(Array.isArray(obj2.unknown)).toBeTruthy();
  expect(obj2.unknown['-17'].path).toBe(3);
});

it('setIn: should create nested arrays for unknown paths with decimal segments', () => {
  const obj2 = timm.setIn(OBJ, ['unknown', 2.2, 'another', -5.3], 'foo');
  expect(Array.isArray(obj2.unknown)).toBeTruthy();
  expect(Array.isArray(obj2.unknown['2.2'].another)).toBeTruthy();
  expect(obj2.unknown['2.2'].another['-5.3']).toBe('foo');
});

it('setIn: should return the value if the path is empty', () => {
  const obj2 = timm.setIn(OBJ, [], { a: 3 });
  expect(obj2).toEqual({ a: 3 });
});

it('setIn: should allow unsetting an attribute', () => {
  const obj2 = timm.setIn(OBJ, ['d', 'd1'], undefined);
  expect(obj2).not.toBe(OBJ);
  expect(obj2.d.d1).toBeUndefined();
});

// ------------------------------------------------
// update()
// ------------------------------------------------
it('update: with changes', () => {
  const obj2 = timm.update(OBJ, 'b', (val) => val + 1);
  expect(OBJ.b).toBe(2);
  expect(obj2).not.toBe(OBJ);
  expect(obj2.b).toBe(3);
});

it("update: should return the same object when it hasn't changed", () => {
  const obj2 = timm.update(OBJ, 'b', (val) => val);
  expect(obj2).toBe(OBJ);
});

it('update: should return a new object when the first parameter is null or undefined and the key is a string', () => {
  expect(timm.update(null, 'b', () => 2)).toEqual({ b: 2 });
  expect(timm.update(undefined, 'b', () => 2)).toEqual({ b: 2 });
});

it('update: should return a new array when the first parameter is null or undefined and the key is a number', () => {
  expect(timm.update(null, 5, () => 2)).toEqual([, , , , , 2]); // eslint-disable-line
  expect(timm.update(undefined, 0, () => 'value')).toEqual(['value']);
});

// ------------------------------------------------
// updateIn()
// ------------------------------------------------
it('updateIn: with changes', () => {
  const obj2 = timm.updateIn(OBJ, ['e', 'e1'], (val) => `${val}x`);
  expect(OBJ.e.e1).toBe('foo');
  expect(obj2).not.toBe(OBJ);
  expect(obj2.e.e1).toBe('foox');
  expect(obj2.d).toBe(OBJ.d);
});

it("updateIn: should return the same object when it hasn't changed", () => {
  const obj2 = timm.updateIn(OBJ, ['e', 'e1'], (val) => val);
  expect(obj2).toBe(OBJ);
});

it('updateIn: should create nested objects for unknown paths', () => {
  const obj2 = timm.updateIn(OBJ, ['unknown', 'long', 'path'], () => 3);
  expect(obj2.unknown.long.path).toBe(3);
});

// ------------------------------------------------
// merge()
// ------------------------------------------------
it('merge: with changes', () => {
  const obj2 = timm.merge(OBJ, { b: 4, c: 3 });
  expect(OBJ.b).toBe(2);
  expect(OBJ.c).toBeUndefined();
  expect(obj2).not.toBe(OBJ);
  expect(obj2.a).toBe(OBJ.a);
  expect(obj2.b).toBe(4);
  expect(obj2.c).toBe(3);
  expect(obj2.d).toBe(OBJ.d);
  expect(obj2.e).toBe(OBJ.e);
});

it('merge: with more than 6 args', () => {
  const obj2 = timm.merge(
    { a: 1 },
    { b: 2 },
    { c: 3 },
    { d: 4 },
    { e: 5 },
    { f: 6 },
    { g: 7 }
  );
  expect(obj2).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 });
});

it('merge: should return the same object when merged with undefined', () => {
  const obj2 = timm.merge(OBJ, undefined);
  expect(obj2).toBe(OBJ);
});

it('merge: should ignore undefined attributes in subsequent args', () => {
  const obj2 = timm.merge(OBJ, { a: undefined });
  expect(obj2).toBe(OBJ);
  expect(OBJ.a).toBe(1);
});

it('merge: should NOT ignore null attributes in subsequent args', () => {
  const obj2 = timm.merge(OBJ, { g: null });
  expect(obj2).not.toBe(OBJ);
  expect(obj2.g).toBe(null);
});

it('merge: should return the same object when merged with null', () => {
  const obj2 = timm.merge(OBJ, null);
  expect(obj2).toBe(OBJ);
});

it('merge: should return the same object when merged with an empty object', () => {
  const obj2 = timm.merge(OBJ, {});
  expect(obj2).toBe(OBJ);
});

it("merge: should return the same object when it hasn't changed", () => {
  const obj2 = timm.merge(OBJ, { b: 2, d: OBJ.d });
  expect(obj2).toBe(OBJ);
});

it('merge: should throw with no args', () => {
  expect(timm.merge).toThrow();
});

it('merge: multiple: with changes', () => {
  const obj2 = timm.merge(OBJ, { b: 4 }, { c: 3 }, { b: 7 });
  expect(OBJ.b).toBe(2);
  expect(OBJ.c).toBeUndefined();
  expect(obj2).not.toBe(OBJ);
  expect(obj2.a).toBe(OBJ.a);
  expect(obj2.b).toBe(7);
  expect(obj2.c).toBe(3);
  expect(obj2.d).toBe(OBJ.d);
  expect(obj2.e).toBe(OBJ.e);
});

it('merge: multiple: should return the same object when merged with undefined, null and empty objects', () => {
  const obj2 = timm.merge(OBJ, undefined, null, {}, null, undefined);
  expect(obj2).toBe(OBJ);
});

it("merge: multiple: should return the same object when it hasn't changed", () => {
  const obj2 = timm.merge(OBJ, { b: 2 }, { d: OBJ.d }, { c: undefined });
  expect(obj2).toBe(OBJ);
});

// ------------------------------------------------
// mergeDeep()
// ------------------------------------------------
it('mergeDeep: should merge deeply', () => {
  const obj1 = { a: 1, b: { a: 1, b: 2, obj: { foo: 3 } }, c: { c1: 8 } };
  const obj2 = timm.mergeDeep(obj1, { b: { b: 3 } });
  expect(obj2).toEqual({
    a: 1,
    b: { a: 1, b: 3, obj: { foo: 3 } },
    c: { c1: 8 },
  });
  expect(obj1.b.obj).toBe(obj2.b.obj); // unaltered branch
  expect(obj1.c).toBe(obj2.c); // unaltered branch
});

it('mergeDeep: multiple: should merge deeply', () => {
  const obj2 = timm.mergeDeep(
    { a: 1, b: { a: 1, b: 1 } },
    { b: { b: 2, c: 2 } },
    { a: 3, b: { c: 3 } }
  );
  expect(obj2).toEqual({ a: 3, b: { a: 1, b: 2, c: 3 } });
});

it("mergeDeep: should return the same object when it hasn't changed", () => {
  const obj1 = { a: 1, b: { a: 1, b: 2 } };
  const obj2 = timm.mergeDeep(obj1, { a: 1, b: {} }, { a: 1, b: obj1.b });
  expect(obj1).toBe(obj2);
});

it("mergeDeep: multiple: should return the same object when it hasn't changed", () => {
  const obj2 = timm.mergeDeep(
    OBJ,
    { b: 2 },
    { d: { b: OBJ.d.b } },
    { c: undefined }
  );
  expect(obj2).toBe(OBJ);
});

it('mergeDeep: with more than 6 args', () => {
  const obj2 = timm.mergeDeep(
    { a: 1 },
    { b: { a: 1 } },
    { c: 3 },
    { d: 4 },
    { e: 5 },
    { f: 6 },
    { b: { b: 2 } }
  );
  expect(obj2).toEqual({ a: 1, b: { a: 1, b: 2 }, c: 3, d: 4, e: 5, f: 6 });
});

it('mergeDeep: should overwrite functions', () => {
  const obj = timm.mergeDeep({ fn: () => 'first' }, { fn: () => 'second' });
  expect(obj.fn()).toBe('second');
});

it('merge: should overwrite functions', () => {
  const obj = timm.merge({ fn: () => 'first' }, { fn: () => 'second' });
  expect(obj.fn()).toBe('second');
});

it('merge: should preserve unmodified Symbols', () => {
  const obj2 = timm.merge(OBJ, { foo: 'bar' });
  expect(obj2[SYMBOL]).toBe(OBJ[SYMBOL]);
});

it('merge: should allow updating Symbol properties', () => {
  const obj2 = timm.merge(OBJ, { [SYMBOL]: 'bar' });
  expect(obj2[SYMBOL]).toBe('bar');
});

// ------------------------------------------------
// mergeIn()
// ------------------------------------------------
it('mergeIn: with changes', () => {
  const obj2 = timm.mergeIn(OBJ, ['d', 'b', 'b'], { a: 3, c: 5 });
  expect(OBJ.d.b.b).toEqual({ b: 4 });
  expect(obj2).not.toBe(OBJ);
  expect(obj2.d.b.b).toEqual({ a: 3, b: 4, c: 5 });
  expect(obj2.e).toBe(OBJ.e);
});

it('mergeIn: should create nested objects for unknown paths', () => {
  const obj2 = timm.mergeIn(OBJ, ['unknown', 'path'], { d: 4 });
  expect(obj2.unknown.path).toEqual({ d: 4 });
});

it('mergeIn: with more than 7 args', () => {
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
  expect(obj2).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 });
});

// ------------------------------------------------
// omit()
// ------------------------------------------------
it('omit: with changes (single attribute)', () => {
  const obj2 = timm.omit(OBJ, 'a');
  expect(obj2.a).toBeUndefined();
  expect(obj2.b).toBe(2);
  expect(obj2[SYMBOL]).toBe('hello world');
  expect(obj2).not.toBe(OBJ);
  expect(obj2.d).toEqual(OBJ.d);
});

it('omit: with changes (multiple attributes)', () => {
  const obj2 = timm.omit(OBJ, ['a', 'b']);
  expect(obj2.a).toBeUndefined();
  expect(obj2.b).toBeUndefined();
  expect(obj2).not.toBe(OBJ);
  expect(obj2.d).toEqual(OBJ.d);
});

it("omit: should return the same object when it hasn't changed", () => {
  const obj2 = timm.omit(OBJ, 'z');
  expect(obj2).toEqual(OBJ);
});

it('omit: should support omitting Symbols', () => {
  const obj2 = timm.omit(OBJ, SYMBOL);
  expect(obj2[SYMBOL]).toBeUndefined();
});

// ------------------------------------------------
// addDefaults()
// ------------------------------------------------
it('addDefaults: with changes', () => {
  const obj2 = timm.addDefaults(OBJ, { b: 4, c: 3 });
  expect(OBJ.b).toBe(2);
  expect(OBJ.c).toBeUndefined();
  expect(obj2).not.toBe(OBJ);
  expect(obj2.a).toBe(OBJ.a);
  expect(obj2.b).toBe(OBJ.b);
  expect(obj2.c).toBe(3);
  expect(obj2.d).toBe(OBJ.d);
  expect(obj2.e).toBe(OBJ.e);
});

it('addDefaults: with changes (null attribute)', () => {
  const obj2 = timm.addDefaults(OBJ, { f: null });
  expect(obj2).not.toBe(OBJ);
  expect(obj2.f).toBe(null);
});

it('addDefaults: with more than 6 args', () => {
  const obj2 = timm.addDefaults(
    { a: 1 },
    { b: 2 },
    { c: 3 },
    { d: 4 },
    { e: 5 },
    { f: 6 },
    { g: 7 }
  );
  expect(obj2).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7 });
});

it('addDefaults: should return the same object when combined with undefined', () => {
  const obj2 = timm.addDefaults(OBJ, undefined);
  expect(obj2).toBe(OBJ);
});

it('addDefaults: should return the same object when combined with null', () => {
  const obj2 = timm.addDefaults(OBJ, null);
  expect(obj2).toBe(OBJ);
});

it('addDefaults: should return the same object when combined with an empty object', () => {
  const obj2 = timm.addDefaults(OBJ, {});
  expect(obj2).toBe(OBJ);
});

it("addDefaults: should return the same object when it hasn't changed", () => {
  const obj2 = timm.addDefaults(OBJ, { b: 2, d: OBJ.d });
  expect(obj2).toBe(OBJ);
});

it('addDefaults: multiple: with changes', () => {
  const obj2 = timm.addDefaults(OBJ, { b: 4 }, { c: 3 }, { b: 7 }, { c: 6 });
  expect(OBJ.b).toBe(2);
  expect(OBJ.c).toBeUndefined();
  expect(obj2).not.toBe(OBJ);
  expect(obj2.a).toBe(OBJ.a);
  expect(obj2.b).toBe(OBJ.b);
  expect(obj2.c).toBe(3);
  expect(obj2.d).toBe(OBJ.d);
  expect(obj2.e).toBe(OBJ.e);
});

it('addDefaults: multiple: should return the same object when combined with undefined, null and empty objects', () => {
  const obj2 = timm.addDefaults(OBJ, undefined, null, {}, null, undefined);
  expect(obj2).toBe(OBJ);
});

it("addDefaults: multiple: should return the same object when it hasn't changed", () => {
  const obj2 = timm.addDefaults(OBJ, { b: 2 }, { d: OBJ.d }, { c: undefined });
  expect(obj2).toBe(OBJ);
});
