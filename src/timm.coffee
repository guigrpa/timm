###
| Timm
| (c) Guillermo Grau Panea 2016
| License: MIT
###
#-----------------------------------------------
#- ### Helpers
#-----------------------------------------------
_throw = (msg) -> throw new Error msg

_clone = (obj) ->
  keys = Object.keys obj
  out = {}
  out[key] = obj[key] for key in keys
  out

MERGE_ERROR = 'MERGE_ERROR'
_merge = (fAddDefaults) ->
  args = arguments
  len = args.length
  not(len > 1) and _throw if process.env.NODE_ENV isnt 'production' then "At least one object should be provided to merge()" else MERGE_ERROR
  out = args[1]
  not(out?) and _throw if process.env.NODE_ENV isnt 'production' then "At least one object should be provided to merge()" else MERGE_ERROR
  fChanged = false
  for idx in [2...len] by 1
    obj = args[idx]
    continue if not obj?
    keys = Object.keys obj
    continue if not keys.length
    for key in keys
      continue if fAddDefaults and out[key] isnt undefined
      continue if obj[key] is out[key]
      if not fChanged
        fChanged = true
        out = _clone out
      out[key] = obj[key]
  out

#-----------------------------------------------
# ### Arrays
#-----------------------------------------------

# #### addLast()
# Returns a new array with an appended item.
# 
# Usage: `addLast(array: Array, val: any): Array`
# 
# ```js
# arr = ['a', 'b']
# arr2 = addLast(arr, 'c')
# // ['a', 'b', 'c']
# arr2 === arr
# // false
# ```
addLast = (array, val) -> array.concat [val]

# #### addFirst()
# Returns a new array with a prepended item.
# 
# Usage: `addFirst(array: Array, val: any): Array`
# 
# ```js
# arr = ['a', 'b']
# arr2 = addFirst(arr, 'c')
# // ['c', 'a', 'b']
# arr2 === arr
# // false
# ```
addFirst = (array, val) -> [val].concat array

# #### removeAt()
# Returns a new array obtained by removing an item at
# a specified index.
#
# Usage: `removeAt(array: Array, idx: number): Array`
# 
# ```js
# arr = ['a', 'b', 'c']
# arr2 = removeAt(arr, 1)
# // ['a', 'c']
# arr2 === arr
# // false
# ```
removeAt = (array, idx) -> array.slice(0, idx).concat array.slice(idx + 1)

# #### replaceAt()
# Returns a new array obtained by replacing an item at
# a specified index. If the provided item is the same
# (*referentially equal to*) the previous item at that position, 
# the original array is returned.
#
# Usage: `replaceAt(array: Array, idx: number, newItem: any): Array`
#
# ```js
# arr = ['a', 'b', 'c']
# arr2 = replaceAt(arr, 1, 'd')
# // ['a', 'd', 'c']
# arr2 === arr
# // false
#
# // ... but the same object is returned if there are no changes:
# replaceAt(arr, 1, 'b') === arr
# // true
# ```
replaceAt = (array, idx, newItem) ->
  return array if array[idx] is newItem
  return array.slice(0, idx)
    .concat [newItem]
    .concat array.slice(idx + 1)

#-----------------------------------------------
# ### Objects
#-----------------------------------------------

# #### set()
# Returns a new object with a modified attribute. 
# If the provided value is the same (*referentially equal to*)
# the previous value, the original object is returned.
#
# Usage: `set(obj: Object, key: string, val: any): Object`
#
# ```js
# obj = {a: 1, b: 2, c: 3}
# obj2 = set(obj, 'b', 5)
# // {a: 1, b: 5, c: 3}
# obj2 === obj
# // false
#
# // ... but the same object is returned if there are no changes:
# set(obj, 'b', 2) === obj
# // true
# ```
set = (obj, key, val) -> 
  return obj if obj[key] is val
  obj2 = _clone obj
  obj2[key] = val
  obj2
## TODO: add vararg support (in an efficient way)

# #### setIn()
# Returns a new object with a modified **nested** attribute.
#
# Usage: `setIn(obj: Object, path: Array<string>, val: any): Object`
# If the provided value is the same (*referentially equal to*)
# the previous value, the original object is returned.
#
# ```js
# obj = {a: 1, b: 2, d: {d1: 3, d2: 4}, e: {e1: 'foo', e2: 'bar'}}
# obj2 = setIn(obj, ['d', 'd1'], 4)
# // {a: 1, b: 2, d: {d1: 4, d2: 4}, e: {e1: 'foo', e2: 'bar'}}
# obj2 === obj
# // false
# obj2.d === obj.d
# // false
# obj2.e === obj.e
# // true
#
# // ... but the same object is returned if there are no changes:
# obj3 = setIn(obj, ['d', 'd1'], 3)
# // {a: 1, b: 2, d: {d1: 3, d2: 4}, e: {e1: 'foo', e2: 'bar'}}
# obj3 === obj
# // true
# obj3.d === obj.d
# // true
# obj3.e === obj.e
# // true
# ```
setIn = (obj, path, val, idx = 0) ->
  key = path[idx]
  if idx is path.length - 1
    newValue = val
  else
    newValue = setIn obj[key], path, val, idx + 1
  return set obj, key, newValue

# #### merge()
# Returns a new object built as follows: the overlapping keys from the 
# second one overwrite the corresponding entries from the first one.
# Similar to `Object.assign()`, but immutable.
#
# Usage: `merge(obj1: Object, obj2: Object): Object`
#
# Variadic: `merge(obj1: Object, ...objects: Object[]): Object`
#
# The unmodified `obj1` is returned if `obj2` does not *provide something
# new to* `obj1`, i.e. if either of the following
# conditions are true:
#
# * `obj2` is `null` or `undefined`
# * `obj2` is an object, but it is empty
# * All attributes of `obj2` are referentially equal to the
#   corresponding attributes of `obj`
#
# ```js
# obj1 = {a: 1, b: 2, c: 3}
# obj2 = {c: 4, d: 5}
# obj3 = merge(obj1, obj2)
# // {a: 1, b: 2, c: 4, d: 5}
# obj3 === obj1
# // false
#
# // ... but the same object is returned if there are no changes:
# merge(obj1, {c: 3}) === obj1
# // true
# ```
merge = (a, b, c, d, e, f) -> 
  if arguments.length <= 6
    return _merge false, a, b, c, d, e, f
  else
    return _merge false, arguments...

# #### addDefaults()
# Returns a new object built as follows: `undefined` keys in the first one
# are filled in with the corresponding values from the second one
# (even if they are `null`).
#
# Usage: `addDefaults(obj: Object, defaults: Object): Object`
#
# Variadic: `addDefaults(obj: Object, ...defaultObjects: Object[]): Object`
#
# ```js
# obj1 = {a: 1, b: 2, c: 3}
# obj2 = {c: 4, d: 5, e: null}
# obj3 = addDefaults(obj1, obj2)
# // {a: 1, b: 2, c: 3, d: 5, e: null}
# obj3 === obj1
# // false
#
# // ... but the same object is returned if there are no changes:
# addDefaults(obj1, {c: 4}) === obj1
# // true
# ```
addDefaults = (a, b, c, d, e, f) ->
  if arguments.length <= 6
    return _merge true, a, b, c, d, e, f
  else
    return _merge true, arguments...

#-----------------------------------------------
#- ### Public API
#-----------------------------------------------
module.exports = {
  addLast, addFirst,
  removeAt, replaceAt,

  set, setIn,
  merge,
  addDefaults,
}
