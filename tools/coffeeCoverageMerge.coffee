istanbul = require 'istanbul'
collector = new istanbul.Collector()
reporter = new istanbul.Reporter()
SYNC = false

_addToCollector = (filePath) ->
  collector.add JSON.parse fs.readFileSync(filePath, 'utf8')

collector.add require '../coverage/coverage-coffee-dev.json'
collector.add require '../coverage/coverage-coffee-prod.json'

reporter.add 'text'
reporter.add 'lcov'

reporter.write collector, SYNC, ->
  console.log "All reports generated"
