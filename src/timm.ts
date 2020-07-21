/*!
 * Timm
 *
 * Immutability helpers with fast reads and acceptable writes.
 *
 * @copyright Guillermo Grau Panea 2016
 * @license MIT
 */

const INVALID_ARGS = 'INVALID_ARGS';

type TimmObject = Record<string, unknown>;
type Key = string | number;

// ===============================================
// ### Helpers
// ===============================================
function throwStr(msg: string): never {
  throw new Error(msg);
}

function getKeysAndSymbols(obj: any): string[] {
  const keys = Object.keys(obj);
  if (Object.getOwnPropertySymbols) {
    // @ts-ignore
    return keys.concat(Object.getOwnPropertySymbols(obj));
  }
  return keys;
}

const hasOwnProperty = {}.hasOwnProperty;

export function clone<T>(obj: T[]): T[];
export function clone<T extends TimmObject>(obj: T): T;
export function clone<T>(obj0: T | T[]): T | T[] {
  // As array
  if (Array.isArray(obj0)) return obj0.slice();

  // As object
  const obj = obj0 as TimmObject;
  const keys = getKeysAndSymbols(obj);
  const out = {} as TimmObject;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    out[key] = obj[key];
  }
  // @ts-ignore (see type tests)
  return out;
}

// Custom guard
function isObject(o: unknown): o is TimmObject {
  return o != null && typeof o === 'object';
}

// _deepFreeze = (obj) ->
//   Object.freeze obj
//   for key in Object.getOwnPropertyNames obj
//     val = obj[key]
//     if isObject(val) and not Object.isFrozen val
//       _deepFreeze val
//   obj

// ===============================================
// -- ### Arrays
// ===============================================

// -- #### addLast()
// -- Returns a new array with an appended item or items.
// --
// -- Usage: `addLast<T>(array: T[], val: T[] | T): T[]`
// --
// -- ```js
// -- arr = ['a', 'b']
// -- arr2 = addLast(arr, 'c')
// -- // ['a', 'b', 'c']
// -- arr2 === arr
// -- // false
// -- arr3 = addLast(arr, ['c', 'd'])
// -- // ['a', 'b', 'c', 'd']
// -- ```
// `array.concat(val)` also handles the scalar case,
// but is apparently very slow
export function addLast<T>(array: T[], val: T[] | T): T[] {
  if (Array.isArray(val)) return array.concat(val);
  return array.concat([val]);
}

// -- #### addFirst()
// -- Returns a new array with a prepended item or items.
// --
// -- Usage: `addFirst<T>(array: T[], val: T[]|T): T[]`
// --
// -- ```js
// -- arr = ['a', 'b']
// -- arr2 = addFirst(arr, 'c')
// -- // ['c', 'a', 'b']
// -- arr2 === arr
// -- // false
// -- arr3 = addFirst(arr, ['c', 'd'])
// -- // ['c', 'd', 'a', 'b']
// -- ```
export function addFirst<T>(array: T[], val: T[] | T): T[] {
  if (Array.isArray(val)) return val.concat(array);
  return [val].concat(array);
}

// -- #### removeLast()
// -- Returns a new array removing the last item.
// --
// -- Usage: `removeLast<T>(array: T[]): T[]`
// --
// -- ```js
// -- arr = ['a', 'b']
// -- arr2 = removeLast(arr)
// -- // ['a']
// -- arr2 === arr
// -- // false
// --
// -- // The same array is returned if there are no changes:
// -- arr3 = []
// -- removeLast(arr3) === arr3
// -- // true
// -- ```
export function removeLast<T>(array: T[]): T[] {
  if (!array.length) return array;
  return array.slice(0, array.length - 1);
}

// -- #### removeFirst()
// -- Returns a new array removing the first item.
// --
// -- Usage: `removeFirst<T>(array: T[]): T[]`
// --
// -- ```js
// -- arr = ['a', 'b']
// -- arr2 = removeFirst(arr)
// -- // ['b']
// -- arr2 === arr
// -- // false
// --
// -- // The same array is returned if there are no changes:
// -- arr3 = []
// -- removeFirst(arr3) === arr3
// -- // true
// -- ```
export function removeFirst<T>(array: T[]): T[] {
  if (!array.length) return array;
  return array.slice(1);
}

// -- #### insert()
// -- Returns a new array obtained by inserting an item or items
// -- at a specified index.
// --
// -- Usage: `insert<T>(array: T[], idx: number, val: T[] | T): T[]`
// --
// -- ```js
// -- arr = ['a', 'b', 'c']
// -- arr2 = insert(arr, 1, 'd')
// -- // ['a', 'd', 'b', 'c']
// -- arr2 === arr
// -- // false
// -- insert(arr, 1, ['d', 'e'])
// -- // ['a', 'd', 'e', 'b', 'c']
// -- ```
export function insert<T>(array: T[], idx: number, val: T[] | T): T[] {
  return array
    .slice(0, idx)
    .concat(Array.isArray(val) ? val : [val])
    .concat(array.slice(idx));
}

// -- #### removeAt()
// -- Returns a new array obtained by removing an item at
// -- a specified index.
// --
// -- Usage: `removeAt<T>(array: T[], idx: number): T[]`
// --
// -- ```js
// -- arr = ['a', 'b', 'c']
// -- arr2 = removeAt(arr, 1)
// -- // ['a', 'c']
// -- arr2 === arr
// -- // false
// --
// -- // The same array is returned if there are no changes:
// -- removeAt(arr, 4) === arr
// -- // true
// -- ```
export function removeAt<T>(array: T[], idx: number): T[] {
  if (idx >= array.length || idx < 0) return array;
  return array.slice(0, idx).concat(array.slice(idx + 1));
}

// -- #### replaceAt()
// -- Returns a new array obtained by replacing an item at
// -- a specified index. If the provided item is the same as
// -- (*referentially equal to*) the previous item at that position,
// -- the original array is returned.
// --
// -- Usage: `replaceAt<T>(array: T[], idx: number, newItem: T): T[]`
// --
// -- ```js
// -- arr = ['a', 'b', 'c']
// -- arr2 = replaceAt(arr, 1, 'd')
// -- // ['a', 'd', 'c']
// -- arr2 === arr
// -- // false
// --
// -- // The same object is returned if there are no changes:
// -- replaceAt(arr, 1, 'b') === arr
// -- // true
// -- ```
export function replaceAt<T>(array: T[], idx: number, newItem: T): T[] {
  if (array[idx] === newItem) return array;
  const len = array.length;
  const result = Array(len);
  for (let i = 0; i < len; i++) {
    result[i] = array[i];
  }
  result[idx] = newItem;
  return result;
}

// ===============================================
// -- ### Collections (objects and arrays)
// ===============================================
// -- The following types are used throughout this section
// -- ```js
// -- type TimmObject = Record<string, unknown>;
// -- type Key = number | string;
// -- ```

// -- #### getIn()
// -- Returns a value from an object at a given path. Works with
// -- nested arrays and objects. If the path does not exist, it returns
// -- `undefined`.
// --
// -- Usage: `getIn(obj: TimmObject, path: Key[]): unknown`
// --
// -- ```js
// -- obj = { a: 1, b: 2, d: { d1: 3, d2: 4 }, e: ['a', 'b', 'c'] }
// -- getIn(obj, ['d', 'd1'])
// -- // 3
// -- getIn(obj, ['e', 1])
// -- // 'b'
// -- ```
export function getIn(obj: undefined, path: Key[]): undefined;
export function getIn(obj: null, path: Key[]): null;
export function getIn(obj: any[] | TimmObject, path: Key[]): unknown;
export function getIn(obj: any, path: Key[]): unknown {
  if (!Array.isArray(path)) {
    throwStr(
      process.env.NODE_ENV !== 'production'
        ? 'A path array should be provided when calling getIn()'
        : INVALID_ARGS
    );
  }
  if (obj == null) return undefined;
  let ptr: any = obj;
  for (let i = 0; i < path.length; i++) {
    const key = path[i];
    ptr = ptr != null ? ptr[key] : undefined;
    if (ptr === undefined) return ptr;
  }
  return ptr;
}

// -- #### set()
// -- Returns a new object with a modified attribute.
// -- If the provided value is the same as (*referentially equal to*)
// -- the previous value, the original object is returned.
// --
// -- Usage: `set<T>(obj: T, key: string, val: T): T`
// -- Or with an array: `set<T>(obj: T[], key: number, val: T): T[]`
// --
// -- ```js
// -- obj = { a: 1, b: 2, c: 3 }
// -- obj2 = set(obj, 'b', 5)
// -- // { a: 1, b: 5, c: 3 }
// -- obj2 === obj
// -- // false
// --
// -- // The same object is returned if there are no changes:
// -- set(obj, 'b', 2) === obj
// -- // true
// -- ```
// When called with an undefined/null `obj`, `set()` returns either
// a single-element array, or a single-key object
export function set<K extends string, V>(
  obj: undefined | null,
  key: K,
  val: V
): { [P in K]: V };
export function set<V>(obj: undefined | null, key: number, val: V): [V];
// Normal operation with an object/array
export function set<T, K extends string, V>(
  obj: T,
  key: K,
  val: V
): Omit<T, keyof { [P in K]: any }> & { [P in K]: V };
export function set<V>(obj: V[], key: number, val: V): V[];
// Implementation
export function set(obj0: any, key: Key, val: any): any {
  let obj = obj0;
  if (obj == null) obj = typeof key === 'number' ? [] : {};
  if (obj[key] === val) return obj;
  const obj2 = clone(obj);
  obj2[key] = val;
  return obj2;
}

// -- #### setIn()
// -- Returns a new object with a modified **nested** attribute.
// --
// -- Notes:
// --
// -- * If the provided value is the same as (*referentially equal to*)
// -- the previous value, the original object is returned.
// -- * If the path does not exist, it will be created before setting
// -- the new value.
// --
// -- Usage: `setIn(obj: any, path: Key[], val: any): unknown`
// --
// -- ```js
// -- obj = { a: 1, b: 2, d: { d1: 3, d2: 4 }, e: { e1: 'foo', e2: 'bar' } }
// -- obj2 = setIn(obj, ['d', 'd1'], 4)
// -- // { a: 1, b: 2, d: { d1: 4, d2: 4 }, e: { e1: 'foo', e2: 'bar' } }
// -- obj2 === obj
// -- // false
// -- obj2.d === obj.d
// -- // false
// -- obj2.e === obj.e
// -- // true
// --
// -- // The same object is returned if there are no changes:
// -- obj3 = setIn(obj, ['d', 'd1'], 3)
// -- // { a: 1, b: 2, d: { d1: 3, d2: 4 }, e: { e1: 'foo', e2: 'bar' } }
// -- obj3 === obj
// -- // true
// -- obj3.d === obj.d
// -- // true
// -- obj3.e === obj.e
// -- // true
// --
// -- // ... unknown paths create intermediate keys. Numeric segments are treated as array indices:
// -- setIn({ a: 3 }, ['unknown', 0, 'path'], 4)
// -- // { a: 3, unknown: [{ path: 4 }] }
// -- ```
export function setIn(obj: any, path: Key[], val: any): unknown {
  if (!path.length) return val;
  return doSetIn(obj, path, val, 0);
}

function doSetIn(obj: any, path: Key[], val: any, idx: number): unknown {
  let newValue;
  const key: any = path[idx];
  if (idx === path.length - 1) {
    newValue = val;
  } else {
    const nestedObj =
      isObject(obj) && isObject(obj[key])
        ? obj[key]
        : typeof path[idx + 1] === 'number'
        ? []
        : {};
    newValue = doSetIn(nestedObj, path, val, idx + 1);
  }
  return set(obj, key, newValue);
}

// -- #### update()
// -- Returns a new object with a modified attribute,
// -- calculated via a user-provided callback based on the current value.
// -- If the calculated value is the same as (*referentially equal to*)
// -- the previous value, the original object is returned.
// --
// -- Usage: `update(obj: any, key: Key,
// -- fnUpdate: (prevValue: any) => any): unknown`
// --
// -- ```js
// -- obj = { a: 1, b: 2, c: 3 }
// -- obj2 = update(obj, 'b', (val) => val + 1)
// -- // { a: 1, b: 3, c: 3 }
// -- obj2 === obj
// -- // false
// --
// -- // The same object is returned if there are no changes:
// -- update(obj, 'b', (val) => val) === obj
// -- // true
// -- ```
export function update(
  obj: any,
  key: Key,
  fnUpdate: (prevValue: any) => any
): unknown {
  const prevVal = obj == null ? undefined : obj[key];
  const nextVal = fnUpdate(prevVal);
  return set(obj, key as any, nextVal);
}

// -- #### updateIn()
// -- Returns a new object with a modified **nested** attribute,
// -- calculated via a user-provided callback based on the current value.
// -- If the calculated value is the same as (*referentially equal to*)
// -- the previous value, the original object is returned.
// --
// -- Usage: `updateIn<T: ArrayOrObject>(obj: T, path: Array<Key>,
// -- fnUpdate: (prevValue: any) => any): T`
// --
// -- ```js
// -- obj = { a: 1, d: { d1: 3, d2: 4 } }
// -- obj2 = updateIn(obj, ['d', 'd1'], (val) => val + 1)
// -- // { a: 1, d: { d1: 4, d2: 4 } }
// -- obj2 === obj
// -- // false
// --
// -- // The same object is returned if there are no changes:
// -- obj3 = updateIn(obj, ['d', 'd1'], (val) => val)
// -- // { a: 1, d: { d1: 3, d2: 4 } }
// -- obj3 === obj
// -- // true
// -- ```
export function updateIn(
  obj: any,
  path: Key[],
  fnUpdate: (prevValue: any) => any
): unknown {
  const prevVal = getIn(obj, path);
  const nextVal = fnUpdate(prevVal);
  return setIn(obj, path, nextVal);
}

// -- #### merge()
// -- Returns a new object built as follows: the overlapping keys from the
// -- second one overwrite the corresponding entries from the first one.
// -- Similar to `Object.assign()`, but immutable.
// --
// -- Usage:
// --
// -- * `merge(obj1: TimmObject, obj2: TimmObject): TimmObject`
// -- * `merge(obj1: TimmObject, ...objects: TimmObject[]): TimmObject`
// --
// -- The unmodified `obj1` is returned if `obj2` does not *provide something
// -- new to* `obj1`, i.e. if either of the following
// -- conditions are true:
// --
// -- * `obj2` is `null` or `undefined`
// -- * `obj2` is an object, but it is empty
// -- * All attributes of `obj2` are `undefined`
// -- * All attributes of `obj2` are referentially equal to the
// --   corresponding attributes of `obj1`
// --
// -- Note that `undefined` attributes in `obj2` do not modify the
// -- corresponding attributes in `obj1`.
// --
// -- ```js
// -- obj1 = { a: 1, b: 2, c: 3 }
// -- obj2 = { c: 4, d: 5 }
// -- obj3 = merge(obj1, obj2)
// -- // { a: 1, b: 2, c: 4, d: 5 }
// -- obj3 === obj1
// -- // false
// --
// -- // The same object is returned if there are no changes:
// -- merge(obj1, { c: 3 }) === obj1
// -- // true
// -- ```

// Signatures:
// - 1 arg
export function merge<T extends TimmObject>(a: T): T;
// - 2 args
export function merge<T extends TimmObject, U extends TimmObject>(
  a: T,
  b: U
): Omit<T, keyof U> & U;
export function merge<T extends TimmObject>(a: T, b: undefined | null): T;
// - 3 args
export function merge<
  T extends TimmObject,
  U extends TimmObject,
  V extends TimmObject
>(a: T, b: U, c: V): Omit<Omit<T, keyof U> & U, keyof V> & V;
export function merge<T extends TimmObject, V extends TimmObject>(
  a: T,
  b: undefined | null,
  c: V
): Omit<T, keyof V> & V;
export function merge<T extends TimmObject, U extends TimmObject>(
  a: T,
  b: U,
  c: undefined | null
): Omit<T, keyof U> & U;
export function merge<T extends TimmObject>(
  a: T,
  b: undefined | null,
  c: undefined | null
): T;
// Implementation and catch-all
export function merge(
  a: TimmObject,
  b?: TimmObject | null,
  c?: TimmObject | null,
  d?: TimmObject | null,
  e?: TimmObject | null,
  f?: TimmObject | null,
  ...rest: Array<TimmObject | null>
): unknown {
  return rest.length
    ? doMerge.call(null, false, false, a, b, c, d, e, f, ...rest)
    : doMerge(false, false, a, b, c, d, e, f);
}

// -- #### mergeDeep()
// -- Returns a new object built as follows: the overlapping keys from the
// -- second one overwrite the corresponding entries from the first one.
// -- If both the first and second entries are objects they are merged recursively.
// -- Similar to `Object.assign()`, but immutable, and deeply merging.
// --
// -- Usage:
// --
// -- * `mergeDeep(obj1: TimmObject, obj2: TimmObject): TimmObject`
// -- * `mergeDeep(obj1: TimmObject, ...objects: TimmObject[]): TimmObject`
// --
// -- The unmodified `obj1` is returned if `obj2` does not *provide something
// -- new to* `obj1`, i.e. if either of the following
// -- conditions are true:
// --
// -- * `obj2` is `null` or `undefined`
// -- * `obj2` is an object, but it is empty
// -- * All attributes of `obj2` are `undefined`
// -- * All attributes of `obj2` are referentially equal to the
// --   corresponding attributes of `obj1`
// --
// -- Note that `undefined` attributes in `obj2` do not modify the
// -- corresponding attributes in `obj1`.
// --
// -- ```js
// -- obj1 = { a: 1, b: 2, c: { a: 1 } }
// -- obj2 = { b: 3, c: { b: 2 } }
// -- obj3 = mergeDeep(obj1, obj2)
// -- // { a: 1, b: 3, c: { a: 1, b: 2 }  }
// -- obj3 === obj1
// -- // false
// --
// -- // The same object is returned if there are no changes:
// -- mergeDeep(obj1, { c: { a: 1 } }) === obj1
// -- // true
// -- ```
export function mergeDeep(
  a: TimmObject,
  b?: TimmObject | null,
  c?: TimmObject | null,
  d?: TimmObject | null,
  e?: TimmObject | null,
  f?: TimmObject | null,
  ...rest: Array<TimmObject | null>
): TimmObject {
  return rest.length
    ? doMerge.call(null, false, true, a, b, c, d, e, f, ...rest)
    : doMerge(false, true, a, b, c, d, e, f);
}

// -- #### mergeIn()
// -- Similar to `merge()`, but merging the value at a given nested path.
// --
// -- Usage examples:
// --
// -- * `mergeIn(obj1: TimmObject, path: Key[], obj2: TimmObject): TimmObject`
// -- * `mergeIn(obj1: TimmObject, path: Key[], ...objects: TimmObject[]): TimmObject`
// --
// -- ```js
// -- obj1 = { a: 1, d: { b: { d1: 3, d2: 4 } } }
// -- obj2 = { d3: 5 }
// -- obj3 = mergeIn(obj1, ['d', 'b'], obj2)
// -- // { a: 1, d: { b: { d1: 3, d2: 4, d3: 5 } } }
// -- obj3 === obj1
// -- // false
// --
// -- // The same object is returned if there are no changes:
// -- mergeIn(obj1, ['d', 'b'], { d2: 4 }) === obj1
// -- // true
// -- ```
export function mergeIn(
  a: any,
  path: Key[],
  b?: TimmObject,
  c?: TimmObject,
  d?: TimmObject,
  e?: TimmObject,
  f?: TimmObject,
  ...rest: TimmObject[]
): unknown {
  let prevVal: any = getIn(a, path);
  if (prevVal == null) prevVal = {};
  let nextVal;
  if (rest.length) {
    nextVal = doMerge.call(null, false, false, prevVal, b, c, d, e, f, ...rest);
  } else {
    nextVal = doMerge(false, false, prevVal, b, c, d, e, f);
  }
  return setIn(a, path, nextVal);
}

// -- #### omit()
// -- Returns an object excluding one or several attributes.
// --
// -- Usage: `omit(obj: TimmObject, attrs: string | string[]): TimmObject`
//
// -- ```js
// -- obj = { a: 1, b: 2, c: 3, d: 4 }
// -- omit(obj, 'a')
// -- // { b: 2, c: 3, d: 4 }
// -- omit(obj, ['b', 'c'])
// -- // { a: 1, d: 4 }
// --
// -- // The same object is returned if there are no changes:
// -- omit(obj, 'z') === obj1
// -- // true
// -- ```
export function omit<T extends TimmObject, K extends string>(
  obj: T,
  attr: K | K[]
): Omit<T, keyof { [P in K]: any }>;
export function omit(obj: TimmObject, attrs: string | string[]): unknown {
  const omitList = Array.isArray(attrs) ? attrs : [attrs];
  let fDoSomething = false;
  for (let i = 0; i < omitList.length; i++) {
    if (hasOwnProperty.call(obj, omitList[i])) {
      fDoSomething = true;
      break;
    }
  }
  if (!fDoSomething) return obj;
  const out: any = {};
  const keys = getKeysAndSymbols(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (omitList.indexOf(key) >= 0) continue;
    out[key] = obj[key];
  }
  return out;
}

// -- #### addDefaults()
// -- Returns a new object built as follows: `undefined` keys in the first one
// -- are filled in with the corresponding values from the second one
// -- (even if they are `null`).
// --
// -- Usage:
// --
// -- * `addDefaults(obj: TimmObject, defaults: TimmObject): TimmObject`
// -- * `addDefaults(obj: TimmObject, ...defaultObjects: TimmObject[]): TimmObject`
// --
// -- ```js
// -- obj1 = { a: 1, b: 2, c: 3 }
// -- obj2 = { c: 4, d: 5, e: null }
// -- obj3 = addDefaults(obj1, obj2)
// -- // { a: 1, b: 2, c: 3, d: 5, e: null }
// -- obj3 === obj1
// -- // false
// --
// -- // The same object is returned if there are no changes:
// -- addDefaults(obj1, { c: 4 }) === obj1
// -- // true
// -- ```
// Signatures:
// - 2 args
export function addDefaults<T extends TimmObject, U extends TimmObject>(
  a: T,
  b: U
): Omit<U, keyof T> & T;
// Implementation and catch-all
export function addDefaults(
  a: TimmObject,
  b: TimmObject,
  c?: TimmObject | null,
  d?: TimmObject | null,
  e?: TimmObject | null,
  f?: TimmObject | null,
  ...rest: Array<TimmObject | null>
): unknown {
  return rest.length
    ? doMerge.call(null, true, false, a, b, c, d, e, f, ...rest)
    : doMerge(true, false, a, b, c, d, e, f);
}

function doMerge(
  fAddDefaults: boolean,
  fDeep: boolean,
  first: TimmObject,
  ...rest: Array<TimmObject | null | undefined>
) {
  let out: any = first;
  if (!(out != null)) {
    throwStr(
      process.env.NODE_ENV !== 'production'
        ? 'At least one object should be provided to merge()'
        : INVALID_ARGS
    );
  }
  let fChanged = false;
  for (let idx = 0; idx < rest.length; idx++) {
    const obj = rest[idx];
    if (obj == null) continue;
    const keys = getKeysAndSymbols(obj);
    if (!keys.length) continue;
    for (let j = 0; j <= keys.length; j++) {
      const key = keys[j];
      if (fAddDefaults && out[key] !== undefined) continue;
      let nextVal = obj[key];
      if (fDeep && isObject(out[key]) && isObject(nextVal)) {
        nextVal = doMerge(fAddDefaults, fDeep, out[key], nextVal);
      }
      if (nextVal === undefined || nextVal === out[key]) continue;
      if (!fChanged) {
        fChanged = true;
        out = clone(out);
      }
      out[key] = nextVal;
    }
  }
  return out;
}

// ===============================================
// ### Public API
// ===============================================
const timm = {
  clone,
  addLast,
  addFirst,
  removeLast,
  removeFirst,
  insert,
  removeAt,
  replaceAt,

  getIn,
  set,
  setIn,
  update,
  updateIn,
  merge,
  mergeDeep,
  mergeIn,
  omit,
  addDefaults,
};

export default timm;
