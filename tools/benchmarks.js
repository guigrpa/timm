process.env.NODE_ENV = 'production';
const _ = require('lodash');
const chalk = require('chalk');
// const Seamless = require('seamless-immutable')
const Seamless = require('seamless-immutable/seamless-immutable.production.min');
const Immutable = require('immutable');
const update = require('immutability-helper');
const timm = require('../lib/timm');

const INITIAL_OBJECT = {
  toggle: false,
  b: 3,
  str: 'foo',
  d: {
    d1: 6,
    d2: 'foo',
    toggle: false,
    d9: { b: { b: { b: 1 } } },
  },
  e: {
    e1: 18,
    e2: 'foo',
  },
};
const DEEP_PATH = ['d', 'd9', 'b', 'b', 'b'];
const ARRAY_LENGTH = 1000;
const INITIAL_ARRAY = new Array(ARRAY_LENGTH);
for (let n = 0; n < ARRAY_LENGTH; n++) {
  INITIAL_ARRAY[n] = { a: 1, b: 2 };
}
const N = 2e5;

const _getIn = (obj, path) => {
  let out = obj;
  path.forEach(key => {
    out = out[key];
  });
  return out;
};

const _mergeDeepInPlace = (obj1, obj2) => {
  Object.keys(obj2).forEach(key => {
    const val = obj2[key];
    if (val == null) obj1[key] = val;
    else if (typeof val === 'object' && val.length != null)
      obj1[key] = _mergeDeepInPlace([], val);
    else if (typeof val === 'object') obj1[key] = _mergeDeepInPlace({}, val);
    else obj1[key] = val;
  });
  return obj1;
};

const _solMutable = {
  init: () => _.cloneDeep(INITIAL_OBJECT),
  get: (obj, key) => obj[key],
  set: (obj, key, val) => {
    obj[key] = val;
    return obj;
  },
  getDeep: (obj, key1, key2) => obj[key1][key2],
  setDeep: (obj, key1, key2, val) => {
    obj[key1][key2] = val;
    return obj;
  },
  getIn: _getIn,
  setIn: (obj, path, val) => {
    let ptr = obj;
    for (let idx = 0; idx < path.length - 1; idx++) {
      ptr = ptr[path[idx]];
    }
    ptr[path[path.length - 1]] = val;
    return obj;
  },
  merge: (obj1, obj2) => {
    Object.keys(obj2).forEach(key => {
      obj1[key] = obj2[key];
    });
    return obj1;
  },
  mergeDeep: (obj1, obj2) => _mergeDeepInPlace(obj1, obj2),
  initArr: () => _.cloneDeep(INITIAL_ARRAY),
  getAt: (arr, idx) => arr[idx],
  setAt: (arr, idx, val) => {
    arr[idx] = val;
    return arr;
  },
};

_solImmutableTimm = {
  init: () => _.cloneDeep(INITIAL_OBJECT),
  get: (obj, key) => obj[key],
  set: (obj, key, val) => timm.set(obj, key, val),
  getDeep: (obj, key1, key2) => obj[key1][key2],
  setDeep: (obj, key1, key2, val) =>
    timm.set(obj, key1, timm.set(obj[key1], key2, val)),
  getIn: _getIn,
  setIn: (obj, path, val) => timm.setIn(obj, path, val),
  merge: (obj1, obj2) => timm.merge(obj1, obj2),
  mergeDeep: (obj1, obj2) => timm.mergeDeep(obj1, obj2),
  initArr: () => _.cloneDeep(INITIAL_ARRAY),
  getAt: (arr, idx) => arr[idx],
  setAt: (arr, idx, val) => timm.replaceAt(arr, idx, val),
};

_solImmutableJs = {
  init: () => Immutable.fromJS(INITIAL_OBJECT), // deep
  get: (obj, key) => obj.get(key),
  set: (obj, key, val) => obj.set(key, val),
  getDeep: (obj, key1, key2) => obj.getIn([key1, key2]),
  setDeep: (obj, key1, key2, val) => obj.setIn([key1, key2], val),
  getIn: (obj, path) => obj.getIn(path),
  setIn: (obj, path, val) => obj.setIn(path, val),
  merge: (obj1, obj2) => obj1.merge(obj2),
  mergeDeep: (obj1, obj2) => obj1.mergeDeep(obj2),
  initArr: () => Immutable.List(INITIAL_ARRAY), // shallow
  getAt: (arr, idx) => arr.get(idx),
  setAt: (arr, idx, val) => arr.set(idx, val),
};

_solImmutableSeamless = {
  init: () => Seamless(INITIAL_OBJECT),
  get: (obj, key) => obj[key],
  set: (obj, key, val) => obj.set(key, val),
  getDeep: (obj, key1, key2) => obj[key1][key2],
  setDeep: (obj, key1, key2, val) => obj.setIn([key1, key2], val),
  getIn: _getIn,
  setIn: (obj, path, val) => obj.setIn(path, val),
  merge: (obj1, obj2) => obj1.merge(obj2),
  mergeDeep: (obj1, obj2) => obj1.merge(obj2, { deep: true }),
  initArr: () => Seamless(INITIAL_ARRAY),
  getAt: (arr, idx) => arr[idx],
  setAt: (arr, idx, val) => arr.set(idx, val),
};

_solImmutableUpdate = {
  init: () => _.cloneDeep(INITIAL_OBJECT),
  get: (obj, key) => obj[key],
  set: (obj, key, val) => {
    const config = {};
    config[key] = { $set: val };
    return update(obj, config);
  },
  getDeep: (obj, key1, key2) => obj[key1][key2],
  setDeep: (obj, key1, key2, val) => {
    const config = {};
    config[key1] = {};
    config[key1][key2] = { $set: val };
    return update(obj, config);
  },
  getIn: _getIn,
  setIn: (obj, path, val) => {
    const config = {};
    const len = path.length;
    let child = config;
    for (let n = 0; n < len; n++) {
      child = child[path[n]] = n === len - 1 ? { $set: val } : {};
    }
    return update(obj, config);
  },
  merge: (obj1, obj2) => update(obj1, { $merge: obj2 }),
  mergeDeep: (obj1, obj2) => update(obj1, _nestedConfig(obj2)),
  initArr: () => _.cloneDeep(INITIAL_ARRAY),
  getAt: (arr, idx) => arr[idx],
  setAt: (arr, idx, val) => {
    const config = {};
    config[idx] = { $set: val };
    return update(arr, config);
  },
};

const _nestedConfig = _.memoize(obj => {
  return Object.keys(obj).reduce((result, key) => {
    const val = obj[key];
    if (typeof val === 'object' && val != null) {
      result[key] = _nestedConfig(val);
    } else {
      result[key] = { $set: val };
    }
    return result;
  }, {});
});

const _toggle = (solution, obj) =>
  solution.set(obj, 'toggle', !solution.get(obj, 'toggle'));

const _addResult = (results, condition) => {
  results.push(condition ? chalk.green.bold('P') : chalk.red('F'));
};

const _verify = solution => {
  const results = [];
  const {
    init,
    get,
    set,
    setDeep,
    getIn,
    setIn,
    merge,
    mergeDeep,
    initArr,
    getAt,
    setAt,
  } = solution;
  let obj;
  let obj2;
  let arr;
  let arr2;

  // Initial conditions
  obj = init();
  _addResult(results, get(obj, 'toggle') === false);
  results.push('-');

  // Changes to root attributes create a new object
  // (but keep the nested object untouched)
  obj2 = set(obj, 'toggle', true);
  _addResult(results, get(obj, 'toggle') === false);
  _addResult(results, get(obj2, 'toggle') === true);
  _addResult(results, obj2 !== obj);
  _addResult(results, get(obj2, 'd') === get(obj, 'd'));
  results.push('-');
  obj2 = set(obj, 'str', 'foo');
  _addResult(results, obj2 === obj);
  _addResult(results, get(obj2, 'd') === get(obj, 'd'));
  results.push('-');

  // Same for deep attributes
  obj2 = setDeep(obj, 'd', 'd1', 3);
  _addResult(results, solution.getDeep(obj, 'd', 'd1') === 6);
  _addResult(results, solution.getDeep(obj2, 'd', 'd1') === 3);
  _addResult(results, obj2 !== obj);
  _addResult(results, get(obj2, 'd') !== get(obj, 'd'));
  _addResult(results, get(obj2, 'e') === get(obj, 'e'));
  results.push('-');

  // If we change an attribute to exactly the same value,
  // no new object is created
  obj2 = set(obj, 'b', get(obj, 'b'));
  _addResult(results, obj2 === obj);
  _addResult(results, get(obj2, 'd') === get(obj, 'd'));
  results.push('-');
  obj2 = set(obj, 'str', 'bar');
  _addResult(results, obj2 !== obj);
  _addResult(results, get(obj2, 'd') === get(obj, 'd'));

  // Same for deep attributes
  obj = init();
  obj2 = setDeep(obj, 'd', 'd1', 6);
  _addResult(results, solution.getDeep(obj, 'd', 'd1') === 6);
  _addResult(results, solution.getDeep(obj2, 'd', 'd1') === 6);
  _addResult(results, obj2 === obj);
  _addResult(results, get(obj2, 'd') === get(obj, 'd'));
  results.push('-');

  // Deep writes
  obj2 = setIn(obj, DEEP_PATH, 3);
  _addResult(results, obj2 !== obj);
  _addResult(results, get(obj2, 'd') !== get(obj, 'd'));
  _addResult(results, get(obj2, 'e') === get(obj, 'e'));
  _addResult(results, getIn(obj, DEEP_PATH) === 1);
  _addResult(results, getIn(obj2, DEEP_PATH) === 3);
  results.push('-');

  // Merge
  obj2 = merge(obj, { c: 5, f: null });
  _addResult(results, obj2 !== obj);
  _addResult(results, get(obj2, 'd') === get(obj, 'd'));
  _addResult(results, get(obj2, 'c') === 5);
  _addResult(results, get(obj2, 'f') === null);
  results.push('-');

  // Deep merge
  obj2 = mergeDeep(obj, { c: 5, f: null, d: { d9: { b: { a: 1 } } } });
  const changedPath = ['d', 'd9', 'b', 'a'];
  const unchangedPath = ['d', 'd9', 'b', 'b'];
  _addResult(results, obj2 !== obj);
  _addResult(results, get(obj2, 'd') !== get(obj, 'd'));
  _addResult(results, getIn(obj2, changedPath) === 1);
  _addResult(results, getIn(obj2, unchangedPath) === getIn(obj, unchangedPath));
  _addResult(results, get(obj2, 'c') === 5);
  _addResult(results, get(obj2, 'f') === null);
  results.push('-');

  // Array writes
  arr = initArr();
  arr2 = setAt(arr, 1, { b: 3 });
  _addResult(results, arr2 !== arr);
  _addResult(results, getAt(arr, 1).b === 2);
  _addResult(results, getAt(arr2, 1).b === 3);
  arr2 = setAt(arr, 1, getAt(arr, 1));
  _addResult(results, arr2 === arr);

  console.log(`  Verification: ${results.join('')}`);
};

const _test = (desc, cb) => {
  const tic = new Date().getTime();
  cb();
  const tac = new Date().getTime();
  console.log(`  ${desc}: ` + chalk.bold(`${tac - tic} ms`));
};

const _allTests = (desc, solution) => {
  console.log(chalk.bold(desc));
  _verify(solution);
  obj = solution.init();
  _test(`Object: read (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const val = solution.get(obj, 'toggle');
    }
  });
  obj = solution.init();
  _test(`Object: write (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const obj2 = solution.set(obj, 'b', n);
    }
  });
  obj = solution.init();
  _test(`Object: deep read (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const val = solution.getDeep(obj, 'd', 'd1');
    }
  });
  obj = solution.init();
  _test(`Object: deep write (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const obj2 = solution.setDeep(obj, 'd', 'd1', n);
    }
  });
  obj = solution.init();
  _test(`Object: very deep read (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const val = solution.getIn(obj, DEEP_PATH);
    }
  });
  obj = solution.init();
  _test(`Object: very deep write (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const obj2 = solution.setIn(obj, DEEP_PATH, n);
    }
  });
  obj = solution.init();
  MERGE_OBJ = { c: 5, f: null };
  _test(`Object: merge (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const obj2 = solution.merge(obj, MERGE_OBJ);
    }
  });
  obj = solution.init();
  MERGE_DEEP_OBJ = { c: 5, f: null, d: { d9: { b: { a: 1 } } } };
  _test(`Object: deep merge (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const obj2 = solution.mergeDeep(obj, MERGE_DEEP_OBJ);
    }
  });
  arr = solution.initArr();
  _test(`Array: read (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const val = solution.getAt(arr, 1);
    }
  });
  arr = solution.initArr();
  _test(`Array: write (x${N})`, () => {
    for (let n = 0; n < N; n++) {
      const arr2 = solution.setAt(arr, 1, n);
    }
  });
};

_allTests('Mutable', _solMutable);
_allTests('Immutable (ImmutableJS)', _solImmutableJs);
_allTests('Immutable (timm)', _solImmutableTimm);
_allTests('Immutable (seamless-immutable)', _solImmutableSeamless);
_allTests('Immutable (immutability-helper)', _solImmutableUpdate);
