/* eslint-disable @typescript-eslint/no-unused-vars */

import timm from '../src/timm';

// https://fettblog.eu/typescript-match-the-exact-object-shape/
type ValidateShape<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never;

const testArrays = () => {
  const arr = ['a', 3];
  const obj = { foo: 'a', bar: { bar1: 4 } };
  interface Obj2 {
    foo: string;
  }
  const obj2: Obj2 = { foo: 'b' };

  // Clone
  const resA: Array<string | number> = timm.clone(arr);
  const resB: { foo: string; bar: { bar1: number } } = timm.clone(obj);
  const obj2clone: Obj2 = timm.clone(obj2);

  // Arrays
  const arr1a: Array<string | number> = timm.addLast(arr, 'a');
  const arr1b: Array<string | number> = timm.addLast(arr, 2);
  const arr1c: Array<string | number> = timm.addLast(arr, ['a', 2]);
  const arr2a: Array<string | number> = timm.addFirst(arr, 'a');
  const arr2b: Array<string | number> = timm.addFirst(arr, 2);
  const arr2c: Array<string | number> = timm.addFirst(arr, ['a', 2]);
  const arr3: Array<string | number> = timm.removeLast(arr);
  const arr4: Array<string | number> = timm.removeFirst(arr);
  const arr5a: Array<string | number> = timm.insert(arr, 1, 'b');
  const arr5b: Array<string | number> = timm.insert(arr, 1, ['b', 3]);
  const arr6: Array<string | number> = timm.removeAt(arr, 1);
  const arr7: Array<string | number> = timm.replaceAt(arr, 1, 'c');

  // Objects
  const res1a = timm.getIn(undefined, ['x']);
  const res1b = timm.getIn(null, ['x']);
  const res1c: string = timm.getIn(obj, ['foo']) as string;
  const res1d: string = timm.getIn(obj2, ['foo']) as string;
  // set with undefined/null
  const res2a: [string] = timm.set(undefined, 0, 'a');
  const res2b: [string] = timm.set(null, 0, 'a');
  const res2c: [undefined] = timm.set(null, 0, undefined);
  const res2d: [null] = timm.set(null, 0, null);
  const res2e: { foo: number } = timm.set(undefined, 'foo', 3);
  const res2f: { foo: string } = timm.set(null, 'foo', 'x');
  // @ts-expect-error
  const res2aInvalid = timm.set(true, 'foo', 'x');
  // set with array
  const res2g: string[] = timm.set(['a', 'b'], 1, 'c');
  const res2h: Array<string | null> = timm.set(['a', 'b'], 1, null);
  // set with object
  const res2i: { foo: number; bar: string } = timm.set(
    { foo: 'a', bar: 'c' },
    'foo',
    3
  );
  // setIn
  type A = { foo: string; bar: { bar1: number; bar2: string } };
  const res3a: A = timm.setIn(obj, ['bar', 'bar2'], 'xx') as A;
  // merge
  const res4a: { foo: number; bar: number } = timm.merge(
    { foo: 3, bar: 'a' },
    { bar: 3 }
  );
  const res4b: { foo: number } = timm.merge({ foo: 3 }, undefined);
  const res4c: { foo: number; bar: number } = timm.merge(
    { foo: 3, bar: 'a' },
    { bar: 'b' },
    { bar: 4 }
  );
  const res4c2: { foo: number; bar: number } = timm.merge(
    { foo: 3, bar: 'a' },
    null,
    { bar: 4 }
  );
  const res4d: { foo: number; bar: boolean } = timm.merge(
    { foo: 3, bar: 'a' },
    { bar: 'b' },
    { bar: 4 },
    { bar: true }
  ) as { foo: number; bar: boolean };
  // omit
  const res5a = timm.omit({ a: 3, b: 'foo' }, 'b');
  (function <T>(_val: ValidateShape<T, { a: number }>) {})(res5a);
  const res5b = timm.omit({ a: 3, b: 'foo', c: 5 }, ['b', 'c']);
  (function <T>(_val: ValidateShape<T, { a: number }>) {})(res5b);
};

// type Dict = Record<string, unknown>;
// type HelloType = {
//   hello: string;
// };
// interface HelloInterface {
//   hello: string;
// }

// let y: Dict;
// const hello1: HelloType = { hello: 'foo' };
// const hello2: HelloInterface = { hello: 'foo' };
// y = hello1;
// y = hello2;

// let z: HelloInterface;
// z = hello1;
// z = hello2;

// interface AA {
//   foo: string;
// }
// interface BB extends AA {
//   bar: number;
// }
// let b: BB;
// const a: AA = b;
