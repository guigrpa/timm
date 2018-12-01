// @flow

// This file tests that Flow types work correctly

/* eslint-disable */

const timm = require('../../src/timm');

type ObjT = {
  str: string,
  num: number,
  nested: {
    str2: string,
    num2: number,
  },
};

const STR_ARRAY: Array<string> = ['a', 'b'];
const ANY_ARRAY = ['a', 'b'];
const OBJ: ObjT = { str: 'foo', num: 4, nested: { str2: 'a', num2: 5 } };

const a1 = timm.clone(STR_ARRAY);
a1.push('a');
// $FlowFixMe Expect error
a1.push(3);
const o1 = timm.clone(OBJ);
// $FlowFixMe Expect error
o1.str = 2;

timm.addFirst(STR_ARRAY, 'c');
timm.addFirst(ANY_ARRAY, 'c');
timm.addFirst(ANY_ARRAY, 4);
// $FlowFixMe Expect error
timm.addFirst(STR_ARRAY, 3);

timm.addFirst(timm.removeAt(STR_ARRAY, 1), 'c');
// $FlowFixMe Expect error
timm.addFirst(timm.removeAt(STR_ARRAY, 1), 3);

const o2 = timm.set(OBJ, 'num', 3.2);
// $FlowFixMe Expect error
o2.str = 3;
const o3 = timm.set({}, 'num', 2);
o3.foo = 'a';

const o4 = timm.setIn(OBJ, ['nested', 'str2'], 'dd');
o4.nested.num2 = 43;
// $FlowFixMe Expect error
o4.nested.str2 = 43;
// $FlowFixMe Expect error
o4.str = 3;

// merge() returns a generic Object; mergeIn() returns the same type of input object
const o5 = timm.merge({ a: 4 }, { b: 3 });
o5.b = 4;
o5.b = 'a';
const o6 = timm.mergeIn(OBJ, ['nested'], { str2: 'bz' });
// $FlowFixMe Expect error
o6.nested.str2 = 5;

// addDefaults() returns a generic Object
const o7 = timm.addDefaults(OBJ, { str: '3', juan: 4 });
o7.str = 5; // no error!
// ...but you can cast it
const o8 = (timm.addDefaults(OBJ, { str: 'dd' }): typeof OBJ);
// $FlowFixMe Expect error
o8.str = 8;
