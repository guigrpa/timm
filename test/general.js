import test from 'ava';
let timm;
if (process.env.TEST_MINIFIED_LIB) {
  timm = require('../lib/timm.min');
} else {
  timm = require('../lib/timm');
}

test('sanity', t => {
  t.ok(timm.set);
});
