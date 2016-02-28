expect = require('chai').expect
if process.env.TEST_MINIFIED_LIB
  console.log "Running tests on minified library"
  timm = require '../dist/timm.min'
else
  timm = require '../src/timm'

it 'sanity', ->
  expect(timm.set).to.exist

describe 'Array operations', ->

  arr = null
  beforeEach ->
    arr = ['a', 'b', 'c']

  describe 'addLast', ->
    it 'with a single value', ->
      arr2 = timm.addLast arr, 'd'
      expect(arr).to.have.length 3
      expect(arr2).to.not.equal arr
      expect(arr2).to.have.length 4
      expect(arr2).to.deep.equal ['a', 'b', 'c', 'd']

    it 'with multiple values', ->
      arr2 = timm.addLast arr, ['d', 'e']
      expect(arr).to.have.length 3
      expect(arr2).to.not.equal arr
      expect(arr2).to.have.length 5
      expect(arr2).to.deep.equal ['a', 'b', 'c', 'd', 'e']

  describe 'addFirst', ->
    it 'with a single value', ->
      arr2 = timm.addFirst arr, 'd'
      expect(arr).to.have.length 3
      expect(arr2).to.not.equal arr
      expect(arr2).to.have.length 4
      expect(arr2).to.deep.equal ['d', 'a', 'b', 'c']

    it 'with multiple values', ->
      arr2 = timm.addFirst arr, ['d', 'e']
      expect(arr).to.have.length 3
      expect(arr2).to.not.equal arr
      expect(arr2).to.have.length 5
      expect(arr2).to.deep.equal ['d', 'e', 'a', 'b', 'c']

  describe 'insert', ->
    it 'with a single value', ->
      arr2 = timm.insert arr, 1, 'e'
      expect(arr).to.have.length 3
      expect(arr2).to.not.equal arr
      expect(arr2).to.have.length 4
      expect(arr2).to.deep.equal ['a', 'e', 'b', 'c']

    it 'with multiple values', ->
      arr2 = timm.insert arr, 1, ['e', 'f']
      expect(arr).to.have.length 3
      expect(arr2).to.not.equal arr
      expect(arr2).to.have.length 5
      expect(arr2).to.deep.equal ['a', 'e', 'f', 'b', 'c']

  it 'removeAt', ->
    arr2 = timm.removeAt arr, 1
    expect(arr).to.have.length 3
    expect(arr2).to.not.equal arr
    expect(arr2).to.have.length 2
    expect(arr2).to.deep.equal ['a', 'c']

  describe 'replaceAt', ->
    it 'with change', ->
      arr2 = timm.replaceAt arr, 1, 'd'
      expect(arr).to.have.length 3
      expect(arr2).to.not.equal arr
      expect(arr2).to.have.length 3
      expect(arr2).to.deep.equal ['a', 'd', 'c']

    it 'should return the same object when it hasn\'t changed', ->
      arr2 = timm.replaceAt arr, 1, 'b'
      expect(arr).to.have.length 3
      expect(arr2).to.equal arr


describe 'Object operations', ->

  obj = null
  arr = null
  beforeEach ->
    obj = {a: 1, b: 2, d: {d1: 3, d2: 4, b: {b: {b: 4}}}, e: {e1: 'foo', e2: 'bar'}, arr: ['c', 'd']}
    arr = [{a: 1}, {a: 2}, {a: 3, d: {d1: 4, d2: 5, d3: null}}]

  describe 'getIn', ->
    it 'with an object root (shallow)', ->
      expect(timm.getIn obj, ['a']).to.equal 1

    it 'with an object root (deep)', ->
      expect(timm.getIn obj, ['d', 'b', 'b', 'b']).to.equal 4

    it 'with an array root (shallow)', ->
      expect(timm.getIn arr, [1]).to.deep.equal {a: 2}

    it 'with an array root (deep)', ->
      expect(timm.getIn arr, [2, 'd', 'd2']).to.equal 5

    it 'with an array root (deep - null value)', ->
      expect(timm.getIn arr, [2, 'd', 'd3']).to.be.null

    it 'should return the object for an empty array', ->
      expect(timm.getIn obj, []).to.equal obj
      expect(timm.getIn arr, []).to.equal arr

    it 'should return undefined for an unknown path', ->
      expect(timm.getIn obj, ['d', 'j']).to.be.undefined
      expect(timm.getIn arr, [23]).to.be.undefined

    it 'should return undefined for an null/undefined object', ->
      expect(timm.getIn null, ['a']).to.be.undefined
      expect(timm.getIn undefined, ['a']).to.be.undefined

    it 'should throw for an unspecified path', ->
      expect(-> timm.getIn obj).to.throw(Error)

  describe 'set', ->
    it 'with change', ->
      obj2 = timm.set obj, 'b', 5
      expect(obj.b).to.equal 2
      expect(obj2).to.not.equal obj
      expect(obj2.b).to.equal 5

    it 'should return the same object when it hasn\'t changed', ->
      obj2 = timm.set obj, 'b', 2
      expect(obj.b).to.equal 2
      expect(obj2).to.equal obj
  
  describe 'setIn', ->
    describe 'level 2', ->
      it 'with change', ->
        obj2 = timm.setIn obj, ['d', 'd1'], 4
        expect(obj.d.d1).to.equal 3
        expect(obj2).to.not.equal obj
        expect(obj2.d).to.not.equal obj.d
        expect(obj2.d.d1).to.equal 4
        expect(obj2.d.b).to.equal obj.d.b
        expect(obj2.e).to.equal obj.e

      it 'should return the same object when it hasn\'t changed', ->
        obj2 = timm.setIn obj, ['d', 'd1'], 3
        expect(obj.d.d1).to.equal 3
        expect(obj2).to.equal obj
        expect(obj2.d).to.equal obj.d
        expect(obj2.d.b).to.equal obj.d.b
        expect(obj2.e).to.equal obj.e

      it 'should not convert arrays to objects', ->
        obj2 = timm.setIn obj, ['arr', 2], 'e'
        expect(obj.arr).to.have.length 2
        expect(obj2).not.to.equal obj
        expect(Array.isArray obj2.arr).to.be.true
        expect(obj2.arr).to.have.length 3
        expect(obj2.arr[2]).to.equal 'e'

    describe 'deeper', ->
      it 'with change', ->
        obj2 = timm.setIn obj, ['d', 'b', 'b', 'b'], 3
        expect(obj.d.b.b.b).to.equal 4
        expect(obj2).to.not.equal obj
        expect(obj2.d).to.not.equal obj.d
        expect(obj2.d.b).to.not.equal obj.d.b
        expect(obj2.d.b.b).to.not.equal obj.d.b.b
        expect(obj2.d.b.b.b).to.equal 3
        expect(obj2.e).to.equal obj.e

      it 'should return the same object when it hasn\'t changed', ->
        obj2 = timm.setIn obj, ['d', 'b', 'b', 'b'], 4
        expect(obj.d.b.b.b).to.equal 4
        expect(obj2).to.equal obj
        expect(obj2.d).to.equal obj.d
        expect(obj2.d.b).to.equal obj.d.b
        expect(obj2.d.b.b).to.equal obj.d.b.b
        expect(obj2.e).to.equal obj.e

    it 'should create nested objects for unknown paths', ->
      obj2 = timm.setIn obj, ['unknown', 'long', 'path'], 3
      expect(obj2.unknown.long.path).to.equal 3

    it 'should return the value if the path is empty', ->
      obj2 = timm.setIn obj, [], {a: 3}
      expect(obj2).to.deep.equal {a: 3}

  describe 'updateIn', ->
    it 'with changes', ->
      obj2 = timm.updateIn obj, ['e', 'e1'], (val) -> val + 'x'
      expect(obj.e.e1).to.equal 'foo'
      expect(obj2).to.not.equal obj
      expect(obj2.e.e1).to.equal 'foox'
      expect(obj2.d).to.equal obj.d

    it 'should return the same object when it hasn\'t changed', ->
      obj2 = timm.updateIn obj, ['e', 'e1'], (val) -> val
      expect(obj2).to.equal obj

    it 'should create nested objects for unknown paths', ->
      obj2 = timm.updateIn obj, ['unknown', 'long', 'path'], (val) -> 3
      expect(obj2.unknown.long.path).to.equal 3

  describe 'merge', ->
    it 'with changes', ->
      obj2 = timm.merge obj, {b: 4, c: 3}
      expect(obj.b).to.equal 2
      expect(obj.c).to.be.undefined
      expect(obj2).to.not.equal obj
      expect(obj2.a).to.equal obj.a
      expect(obj2.b).to.equal 4
      expect(obj2.c).to.equal 3
      expect(obj2.d).to.equal obj.d
      expect(obj2.e).to.equal obj.e

    it 'with more than 6 args', ->
      obj2 = timm.merge {a: 1}, {b: 2}, {c: 3}, {d: 4}, {e: 5}, {f: 6}, {g: 7}
      expect(obj2).to.deep.equal {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7}

    it 'should return the same object when merged with undefined', ->
      obj2 = timm.merge obj, undefined
      expect(obj2).to.equal obj

    it 'should return the same object when merged with null', ->
      obj2 = timm.merge obj, null
      expect(obj2).to.equal obj

    it 'should return the same object when merged with an empty object', ->
      obj2 = timm.merge obj, {}
      expect(obj2).to.equal obj

    it 'should return the same object when it hasn\'t changed', ->
      obj2 = timm.merge obj, {b: 2, d: obj.d}
      expect(obj2).to.equal obj

    it 'should throw with no args', -> expect(timm.merge).to.throw(Error)

    describe 'merge multiple', ->
      it 'with changes', ->
        obj2 = timm.merge obj, {b: 4}, {c: 3}, {b: 7}
        expect(obj.b).to.equal 2
        expect(obj.c).to.be.undefined
        expect(obj2).to.not.equal obj
        expect(obj2.a).to.equal obj.a
        expect(obj2.b).to.equal 7
        expect(obj2.c).to.equal 3
        expect(obj2.d).to.equal obj.d
        expect(obj2.e).to.equal obj.e

      it 'should return the same object when merged with undefined, null and empty objects', ->
        obj2 = timm.merge obj, undefined, null, {}, null, undefined
        expect(obj2).to.equal obj

      it 'should return the same object when it hasn\'t changed', ->
        obj2 = timm.merge obj, {b: 2}, {d: obj.d}, {c: undefined}
        expect(obj2).to.equal obj

  describe 'mergeIn', ->
    it 'with changes', ->
      obj2 = timm.mergeIn obj, ['d', 'b', 'b'], {a: 3, c: 5}
      expect(obj.d.b.b).to.deep.equal {b: 4}
      expect(obj2).to.not.equal obj
      expect(obj2.d.b.b).to.deep.equal {a: 3, b: 4, c: 5}
      expect(obj2.e).to.equal obj.e

    it 'should create nested objects for unknown paths', ->
      obj2 = timm.mergeIn obj, ['unknown', 'path'], {d: 4}
      expect(obj2.unknown.path).to.deep.equal {d: 4}

    it 'with more than 7 args', ->
      obj2 = timm.mergeIn {a: 1}, [], {b: 2}, {c: 3}, {d: 4}, {e: 5}, {f: 6}, {g: 7}
      expect(obj2).to.deep.equal {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7}

  describe 'addDefaults', ->
    it 'with changes', ->
      obj2 = timm.addDefaults obj, {b: 4, c: 3}
      expect(obj.b).to.equal 2
      expect(obj.c).to.be.undefined
      expect(obj2).to.not.equal obj
      expect(obj2.a).to.equal obj.a
      expect(obj2.b).to.equal obj.b
      expect(obj2.c).to.equal 3
      expect(obj2.d).to.equal obj.d
      expect(obj2.e).to.equal obj.e

    it 'with changes (null attribute)', ->
      obj2 = timm.addDefaults obj, {f: null}
      expect(obj2).to.not.equal obj
      expect(obj2.f).to.be.null

    it 'with more than 6 args', ->
      obj2 = timm.addDefaults {a: 1}, {b: 2}, {c: 3}, {d: 4}, {e: 5}, {f: 6}, {g: 7}
      expect(obj2).to.deep.equal {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7}

    it 'should return the same object when combined with undefined', ->
      obj2 = timm.addDefaults obj, undefined
      expect(obj2).to.equal obj

    it 'should return the same object when combined with null', ->
      obj2 = timm.addDefaults obj, null
      expect(obj2).to.equal obj

    it 'should return the same object when combined with an empty object', ->
      obj2 = timm.addDefaults obj, {}
      expect(obj2).to.equal obj

    it 'should return the same object when it hasn\'t changed', ->
      obj2 = timm.addDefaults obj, {b: 2, d: obj.d}
      expect(obj2).to.equal obj

    describe 'addDefaults multiple', ->
      it 'with changes', ->
        obj2 = timm.addDefaults obj, {b: 4}, {c: 3}, {b: 7}, {c: 6}
        expect(obj.b).to.equal 2
        expect(obj.c).to.be.undefined
        expect(obj2).to.not.equal obj
        expect(obj2.a).to.equal obj.a
        expect(obj2.b).to.equal obj.b
        expect(obj2.c).to.equal 3
        expect(obj2.d).to.equal obj.d
        expect(obj2.e).to.equal obj.e

      it 'should return the same object when combined with undefined, null and empty objects', ->
        obj2 = timm.addDefaults obj, undefined, null, {}, null, undefined
        expect(obj2).to.equal obj

      it 'should return the same object when it hasn\'t changed', ->
        obj2 = timm.addDefaults obj, {b: 2}, {d: obj.d}, {c: undefined}
        expect(obj2).to.equal obj
