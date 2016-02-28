istanbul = require 'istanbul'
chalk = require 'chalk'

collector = new istanbul.Collector()
reporter = new istanbul.Reporter()
SYNC = false

console.log "Merging #{chalk.yellow.bold 'DEVELOPMENT'} and " +
  "#{chalk.yellow.bold 'PRODUCTION'} coverage results..."

collector.add require '../coverage/coverage-coffee-DEVELOPMENT.json'
collector.add require '../coverage/coverage-coffee-PRODUCTION.json'
reporter.add 'text'
reporter.add 'lcov'
reporter.write collector, SYNC, ->
  console.log "All reports generated"
