import timm from '../timm';

const testArrays = () => {
  const arr = ['a', 3];
  const obj = { foo: 'a', bar: { bar1: 4 } };

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

  // Objects/arrays
  const resA: Array<string | number> = timm.clone(arr);
  const resB: { foo: string; bar: { bar1: number } } = timm.clone(obj);
};
