_ = require 'lodash'

#-----------------------------------------------
# Arrays
#-----------------------------------------------
addLast = (array, val) -> array.concat [val]

addFirst = (array, val) -> [val].concat array

removeAt = (array, idx) -> array.slice(0, idx).concat array.slice(idx + 1)

replaceAt = (array, idx, newVal) -> 
  return array.slice(0, idx)
    .concat [newVal]
    .concat array.slice(idx + 1)

#-----------------------------------------------
# Objects
#-----------------------------------------------
merge = (obj1, obj2) -> 
  return obj1 if not obj2?
  keys2 = Object.keys obj2
  return obj1 if not keys2.length
  fSomethingNew = false
  for key in keys2
    if obj1[key] isnt obj2[key]
      fSomethingNew = true
      break
  return obj1 if not fSomethingNew
  return _.extend _.clone(obj1), obj2

addDefaults = (obj, defaults) -> 
  return obj if not defaults? or not Object.keys(defaults).length
  return _.defaults _.clone(obj), defaults

set = (obj1, key, val) -> 
  return obj1 if obj1[key] is val
  return _.extend {}, obj1, {"#{key}": val}
# TODO: add vararg support (in an efficient way)

setIn = (obj, path, val, idx = 0) ->
  key = path[idx]
  if idx is path.length - 1
    newValue = val
  else
    newValue = _solImmutableTimm.setIn obj[key], path, val, idx + 1
  return timm.set obj, key, newValue

#-----------------------------------------------
# Public API
#-----------------------------------------------
module.exports = {
  addLast, addFirst,
  removeAt, replaceAt,

  merge,
  addDefaults,
  set, setIn,
}
