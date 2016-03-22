return if not process.env.TEST_COV

chalk = require 'chalk'
path = require 'path'
coffeeCoverage = require 'coffee-coverage'

target = process.env.NODE_ENV.toUpperCase()
console.log "Configuring coffee-coverage for #{chalk.yellow.bold target}..."

projectRoot = path.resolve __dirname, ".."
coverageVar = coffeeCoverage.findIstanbulVariable()
# Only write a coverage report if we're not running inside of Istanbul.
covFileName = "coverage-coffee-#{target}.json"
writeOnExit = if not coverageVar? then "#{projectRoot}/coverage/#{covFileName}" else null

coffeeCoverage.register
  instrumentor: 'istanbul'
  basePath: projectRoot
  exclude: ['/test', '/node_modules', '/.git', '/tools']
  coverageVar: coverageVar
  writeOnExit: writeOnExit
  initAll: true
