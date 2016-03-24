timm = require '../lib/timm.min'
chalk = require 'chalk'

N = 2e6

arr = ['a', 'b', 'c']
tic = new Date()
for n in [0...N]
  arr2 = timm.addLast arr, 'd'
tac = new Date()
console.log "addLast: #{tac - tic} ms"

arr = ['a', 'b', 'c']
tic = new Date()
for n in [0...N]
  arr2 = timm.addFirst arr, 'd'
tac = new Date()
console.log "addFirst: #{tac - tic} ms"
