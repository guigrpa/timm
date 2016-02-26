if (!process.env.TEST_COV) {
  return;
}
console.log("Configuring coffee-coverage...");

var path = require('path');
var coffeeCoverage = require('coffee-coverage');
var projectRoot = path.resolve(__dirname, "..");
var coverageVar = coffeeCoverage.findIstanbulVariable();
// Only write a coverage report if we're not running inside of Istanbul.
var covFileName = process.env.NODE_ENV === 'production'
  ? "coverage-coffee-prod.json"
  : "coverage-coffee-dev.json"
var writeOnExit = (coverageVar == null) ? (projectRoot + '/coverage/' + covFileName) : null;

coffeeCoverage.register({
    instrumentor: 'istanbul',
    basePath: projectRoot,
    exclude: ['/test', '/node_modules', '/.git', '/tools'],
    coverageVar: coverageVar,
    writeOnExit: writeOnExit,
    initAll: true
});
