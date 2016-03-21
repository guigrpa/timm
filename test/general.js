import test from 'ava';
if (process.env.TEST_MINIFIED_LIB) {
  var timm = require('../dist/timm.min');
} else {
  var timm = require('../dist/timm');
}

test('sanity', t => {
  t.ok(timm.set);
});
