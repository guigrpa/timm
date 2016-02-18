fs = require 'fs'

out = ''
code = fs.readFileSync './src/index.coffee', 'utf8'
lines = code.split '\n'
fCode = false
for line in lines
  line = line.trim()

  # Code lines
  if (not line.length) or
     (line[0] isnt '#') or
     (line.length >= 2 and line[1] in ['#', '-'])
    if not fCode then out += '\n'
    fCode = true
    continue

  fCode = false
  line = line.slice 2

  out += "#{line}\n"

out = out.trim()
console.log out
