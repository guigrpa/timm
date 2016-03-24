process.env.NODE_ENV = 'production'
_                   = require 'lodash'
chalk               = require 'chalk'
Seamless            = require 'seamless-immutable'
Immutable           = require 'immutable'
timm                = require '../lib/timm.min'

INITIAL_OBJECT = 
  toggle: false
  b: 3
  str: 'foo'
  d:
    d1: 6
    d2: 'foo'
    toggle: false
    d9: b: b: b: 1
  e:
    e1: 18
    e2: 'foo'
DEEP_PATH = ['d', 'd9', 'b', 'b', 'b']
ARRAY_LENGTH = 1000
INITIAL_ARRAY = new Array(ARRAY_LENGTH)
for n in [0...ARRAY_LENGTH]
  INITIAL_ARRAY[n] = {a: 1, b: 2}
N = 2e5

_getIn = (obj, path) ->
  out = obj
  out = out[key] for key in path
  out

_solMutable = 
  init: -> _.cloneDeep INITIAL_OBJECT
  get: (obj, key) -> obj[key]
  set: (obj, key, val) -> obj[key] = val; obj
  getDeep: (obj, key1, key2) -> obj[key1][key2]
  setDeep: (obj, key1, key2, val) -> obj[key1][key2] = val; obj
  getIn: _getIn
  setIn: (obj, path, val) -> 
    ptr = obj
    for idx in [0...(path.length - 1)]
      ptr = ptr[path[idx]]
    ptr[path[path.length - 1]] = val
    obj
  merge: (obj1, obj2) -> 
    for key in Object.keys obj2
      obj1[key] = obj2[key]
  initArr: -> _.cloneDeep INITIAL_ARRAY
  getAt: (arr, idx) -> arr[idx]
  setAt: (arr, idx, val) -> arr[idx] = val; arr

_solImmutableTimm =
  init: -> _.cloneDeep INITIAL_OBJECT
  get: (obj, key) -> obj[key]
  set: (obj, key, val) -> timm.set obj, key, val
  getDeep: (obj, key1, key2) -> obj[key1][key2]
  setDeep: (obj, key1, key2, val) ->
    return timm.set obj, key1, \
      timm.set(obj[key1], key2, val)
  getIn: _getIn
  setIn: (obj, path, val) -> timm.setIn obj, path, val
  merge: (obj1, obj2) -> timm.merge obj1, obj2
  initArr: -> _.cloneDeep INITIAL_ARRAY
  getAt: (arr, idx) -> arr[idx]
  setAt: (arr, idx, val) -> timm.replaceAt arr, idx, val

_solImmutableJs =
  init: -> Immutable.fromJS INITIAL_OBJECT   # deep
  get: (obj, key) -> obj.get key
  set: (obj, key, val) -> obj.set key, val
  getDeep: (obj, key1, key2) -> obj.getIn [key1, key2]
  setDeep: (obj, key1, key2, val) -> obj.setIn [key1, key2], val
  getIn: (obj, path) -> obj.getIn path
  setIn: (obj, path, val) -> obj.setIn path, val
  merge: (obj1, obj2) -> obj1.merge obj2
  initArr: -> Immutable.List INITIAL_ARRAY   # shallow
  getAt: (arr, idx) -> arr.get idx
  setAt: (arr, idx, val) -> arr.set idx, val

_solImmutableSeamless =
  init: -> Seamless INITIAL_OBJECT
  get: (obj, key) -> obj[key]
  set: (obj, key, val) -> obj.set key, val
  getDeep: (obj, key1, key2) -> obj[key1][key2]
  setDeep: (obj, key1, key2, val) -> obj.setIn [key1, key2], val
  getIn: _getIn
  setIn: (obj, path, val) -> obj.setIn path, val
  merge: (obj1, obj2) -> obj1.merge obj2
  initArr: -> Seamless INITIAL_ARRAY
  getAt: (arr, idx) -> arr[idx]
  setAt: (arr, idx, val) -> arr.set idx, val

_toggle = (solution, obj) ->
  return solution.set obj, 'toggle', not(solution.get obj, 'toggle')

_addResult = (results, condition) ->
  results.push if condition then chalk.green.bold('P') else chalk.green.red('F')
_verify = (solution) ->
  results = []
  {init, get, set, setDeep, getIn, setIn, merge, initArr, getAt, setAt} = solution

  # Initial conditions
  obj = init()
  _addResult results, (get(obj, 'toggle') is false)
  results.push '-'

  # Changes to root attributes create a new object
  # (but keep the nested object untouched)
  obj2 = set obj, 'toggle', true
  _addResult results, (get(obj, 'toggle') is false)
  _addResult results, (get(obj2, 'toggle') is true)
  _addResult results, (obj2 isnt obj)
  _addResult results, (get(obj2, 'd') is get(obj, 'd'))
  results.push '-'
  obj2 = set(obj, 'str', 'foo')
  _addResult results, (obj2 is obj)
  _addResult results, (get(obj2, 'd') is get(obj, 'd'))
  results.push '-'

  # Same for deep attributes
  obj2 = setDeep(obj, 'd', 'd1', 3)
  _addResult results, (solution.getDeep(obj,  'd', 'd1') is 6)
  _addResult results, (solution.getDeep(obj2, 'd', 'd1') is 3)
  _addResult results, (obj2 isnt obj)
  _addResult results, (get(obj2, 'd') isnt get(obj, 'd'))
  _addResult results, (get(obj2, 'e') is get(obj, 'e'))
  results.push '-'

  # If we change an attribute to exactly the same value,
  # no new object is created
  obj2 = set(obj, 'b', get(obj, 'b'))
  _addResult results, (obj2 is obj)
  _addResult results, (get(obj2, 'd') is get(obj, 'd'))
  results.push '-'
  obj2 = set(obj, 'str', 'bar')
  _addResult results, (obj2 isnt obj)
  _addResult results, (get(obj2, 'd') is get(obj, 'd'))

  # Same for deep attributes
  obj = init()
  obj2 = setDeep(obj, 'd', 'd1', 6)
  _addResult results, (solution.getDeep(obj,  'd', 'd1') is 6)
  _addResult results, (solution.getDeep(obj2, 'd', 'd1') is 6)
  _addResult results, (obj2 is obj)
  _addResult results, (get(obj2, 'd') is get(obj, 'd'))
  results.push '-'

  # Deep writes
  obj2 = setIn(obj, DEEP_PATH, 3)
  _addResult results, (obj2 isnt obj)
  _addResult results, (get(obj2, 'd') isnt get(obj, 'd'))
  _addResult results, (get(obj2, 'e') is get(obj, 'e'))
  _addResult results, (getIn(obj, DEEP_PATH) is 1)
  _addResult results, (getIn(obj2, DEEP_PATH) is 3)
  results.push '-'

  # Merge
  obj2 = merge obj, {c: 5, f: null}
  _addResult results, (obj2 isnt obj)
  _addResult results, (get(obj2, 'd') is get(obj, 'd'))
  _addResult results, (get(obj2, 'c') is 5)
  _addResult results, (get(obj2, 'f') is null)
  results.push '-'

  # Array writes
  arr = initArr()
  arr2 = setAt(arr, 1, {b: 3})
  _addResult results, (arr2 isnt arr)
  _addResult results, (getAt(arr, 1).b is 2)
  _addResult results, (getAt(arr2, 1).b is 3)
  arr2 = setAt(arr, 1, getAt(arr, 1))
  _addResult results, (arr2 is arr)

  console.log "  Verification: #{results.join ''}"

_test = (desc, cb) ->
  tic = new Date().getTime()
  cb()
  tac = new Date().getTime()
  console.log "  #{desc}: " + chalk.bold "#{tac - tic} ms"

_allTests = (desc, solution) ->
  console.log chalk.bold desc
  _verify solution
  obj = solution.init()
  _test "Object: read (x#{N})", -> 
    for n in [0...N]
      val = solution.get(obj, 'toggle')
    return
  obj = solution.init()
  _test "Object: write (x#{N})", -> 
    for n in [0...N]
      obj2 = solution.set(obj, 'b', n)
    return
  obj = solution.init()
  _test "Object: deep read (x#{N})", -> 
    for n in [0...N]
      val = solution.getDeep(obj, 'd', 'd1')
    return
  obj = solution.init()
  _test "Object: deep write (x#{N})", -> 
    for n in [0...N]
      obj2 = solution.setDeep(obj, 'd', 'd1', n)
    return
  obj = solution.init()
  _test "Object: very deep read (x#{N})", -> 
    for n in [0...N]
      val = solution.getIn(obj, DEEP_PATH)
    return
  obj = solution.init()
  _test "Object: very deep write (x#{N})", -> 
    for n in [0...N]
      obj2 = solution.setIn(obj, DEEP_PATH, n)
    return
  obj = solution.init()
  MERGE_OBJ = {c: 5, f: null}
  _test "Object: merge (x#{N})", -> 
    for n in [0...N]
      obj2 = solution.merge(obj, MERGE_OBJ)
    return
  arr = solution.initArr()
  _test "Array: read (x#{N})", -> 
    for n in [0...N]
      val = solution.getAt(arr, 1)
    return
  arr = solution.initArr()
  _test "Array: write (x#{N})", -> 
    for n in [0...N]
      arr2 = solution.setAt(arr, 1, n)
    return

_allTests "Mutable", _solMutable
_allTests "Immutable (ImmutableJS)", _solImmutableJs
_allTests "Immutable (timm)", _solImmutableTimm
_allTests "Immutable (seamless-immutable)", _solImmutableSeamless
