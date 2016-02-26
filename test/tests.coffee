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

    it 'without change', ->
      arr2 = timm.replaceAt arr, 1, 'b'
      expect(arr).to.have.length 3
      expect(arr2).to.equal arr


describe 'Object operations', ->

  obj = null
  beforeEach ->
    obj = {a: 1, b: 2, d: {d1: 3, d2: 4, b: {b: {b: 4}}}, e: {e1: 'foo', e2: 'bar'}}

  describe 'set', ->
    it 'with change', ->
      obj2 = timm.set obj, 'b', 5
      expect(obj.b).to.equal 2
      expect(obj2).to.not.equal obj
      expect(obj2.b).to.equal 5

    it 'without change', ->
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

      it 'without change', ->
        obj2 = timm.setIn obj, ['d', 'd1'], 3
        expect(obj.d.d1).to.equal 3
        expect(obj2).to.equal obj
        expect(obj2.d).to.equal obj.d
        expect(obj2.d.b).to.equal obj.d.b
        expect(obj2.e).to.equal obj.e

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

      it 'without change', ->
        obj2 = timm.setIn obj, ['d', 'b', 'b', 'b'], 4
        expect(obj.d.b.b.b).to.equal 4
        expect(obj2).to.equal obj
        expect(obj2.d).to.equal obj.d
        expect(obj2.d.b).to.equal obj.d.b
        expect(obj2.d.b.b).to.equal obj.d.b.b
        expect(obj2.e).to.equal obj.e

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

    it 'with undefined', ->
      obj2 = timm.merge obj, undefined
      expect(obj2).to.equal obj

    it 'with null', ->
      obj2 = timm.merge obj, null
      expect(obj2).to.equal obj

    it 'with empty object', ->
      obj2 = timm.merge obj, {}
      expect(obj2).to.equal obj

    it 'without changes', ->
      obj2 = timm.merge obj, {b: 2, d: obj.d}
      expect(obj2).to.equal obj

    it 'with more than 6 args', ->
      obj2 = timm.merge {a: 1}, {b: 2}, {c: 3}, {d: 4}, {e: 5}, {f: 6}, {g: 7}
      expect(obj2).to.deep.equal {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7}

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

    it 'with undefined, null and empty objects', ->
      obj2 = timm.merge obj, undefined, null, {}, null, undefined
      expect(obj2).to.equal obj

    it 'without changes', ->
      obj2 = timm.merge obj, {b: 2}, {d: obj.d}, {c: undefined}
      expect(obj2).to.equal obj

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

    it 'with undefined', ->
      obj2 = timm.addDefaults obj, undefined
      expect(obj2).to.equal obj

    it 'with null', ->
      obj2 = timm.addDefaults obj, null
      expect(obj2).to.equal obj

    it 'with empty object', ->
      obj2 = timm.addDefaults obj, {}
      expect(obj2).to.equal obj

    it 'without changes', ->
      obj2 = timm.addDefaults obj, {b: 2, d: obj.d}
      expect(obj2).to.equal obj

    it 'with more than 6 args', ->
      obj2 = timm.addDefaults {a: 1}, {b: 2}, {c: 3}, {d: 4}, {e: 5}, {f: 6}, {g: 7}
      expect(obj2).to.deep.equal {a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7}

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

    it 'with undefined, null and empty objects', ->
      obj2 = timm.addDefaults obj, undefined, null, {}, null, undefined
      expect(obj2).to.equal obj

    it 'without changes', ->
      obj2 = timm.addDefaults obj, {b: 2}, {d: obj.d}, {c: undefined}
      expect(obj2).to.equal obj
