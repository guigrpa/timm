# # API

_ = require 'lodash'

#-----------------------------------------------
# ## Arrays
#-----------------------------------------------

# **addLast**: add an item to the end of the array.
# * *Array* `array`
# * *Any* `val`
# * Returns *Array*
addLast = (array, val) -> array.concat [val]

# **addFirst**: add an item to the beginning of the array. 
# * *Array* `array`
# * *Any* `val`
# * Returns *Array*
addFirst = (array, val) -> [val].concat array

# **removeAt**: remove the item at a given index. 
# * *Array* `array`
# * *Integer* `idx`
# * Returns *Array*
removeAt = (array, idx) -> array.slice(0, idx).concat array.slice(idx + 1)

# **replaceAt**: replace the item at a given index. 
# * *Array* `array`
# * *Integer* `idx`
# * *Any* `newItem`
# * Returns *Array*
replaceAt = (array, idx, newItem) -> 
  return array.slice(0, idx)
    .concat [newItem]
    .concat array.slice(idx + 1)

#-----------------------------------------------
# ## Objects
#-----------------------------------------------

# **merge**: merge two objects; the overlapping keys from the 
# second one will overwrite the corresponding entries from the first.
# * *Object* `obj1`
# * *Object* `obj2`
# * Returns *Object*
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

# **addDefaults**: for undefined keys in the first object,
# add the corresponding entries from the second object.
# * *Object* `obj`
# * *Object* `defaults`
# * Returns *Object*
addDefaults = (obj, defaults) -> 
  return obj if not defaults? or not Object.keys(defaults).length
  return _.defaults _.clone(obj), defaults

# **set**: modify an attribute of an object.
# * *Object* `obj`
# * *String* `key`
# * *Any* `val`
# * Returns *Object*
set = (obj, key, val) -> 
  return obj if obj[key] is val
  return _.extend {}, obj, {"#{key}": val}
## TODO: add vararg support (in an efficient way)

# **setIn**: modify a nested attribute of an object.
# * *Object* `obj`
# * *Array* `path`
# * *Any* `val`
# * Returns *Object*
setIn = (obj, path, val, idx = 0) ->
  key = path[idx]
  if idx is path.length - 1
    newValue = val
  else
    newValue = setIn obj[key], path, val, idx + 1
  return timm.set obj, key, newValue

#-----------------------------------------------
# ## Public API
#-----------------------------------------------
module.exports = {
  addLast, addFirst,
  removeAt, replaceAt,

  merge,
  addDefaults,
  set, setIn,
}
