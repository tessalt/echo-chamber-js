md5 = require('../src/md5.js');
expect = require('expect.js');
require('./test.js');

delete require.cache[require.resolve('../src/md5.js')]
delete require.cache[require.resolve('./test.js')]
md5 = null

JS_MD5_TEST = true;
require('../src/md5.js');
require('./test.js');
