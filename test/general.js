import test from 'ava';
if (process.env.TEST_MINIFIED_LIB) {
  var timm = require('../lib/timm.min');
} else {
  var timm = require('../lib/timm');
}

test('sanity', t => {
  t.ok(timm.set);
});
