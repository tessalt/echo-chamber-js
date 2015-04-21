var extensions = {
  '.babel.js': 'babel/register',
  '.cirru': 'cirru-script/lib/register',
  '.cjsx': 'node-cjsx/register',
  '.co': 'coco',
  '.coffee': 'coffee-script/register',
  '.coffee.md': 'coffee-script/register',
  '.csv': 'require-csv',
  '.iced': 'iced-coffee-script/register',
  '.iced.md': 'iced-coffee-script/register',
  '.ini': 'require-ini',
  '.js': null,
  '.json': null,
  '.json5': 'json5/lib/require',
  '.jsx': 'node-jsx',
  '.litcoffee': 'coffee-script/register',
  '.liticed': 'iced-coffee-script/register',
  '.ls': 'LiveScript',
  '.node': null,
  '.toml': 'toml-require',
  '.ts': 'typescript-register',
  '.wisp': 'wisp/engine/node',
  '.xml': 'require-xml',
  '.yaml': 'require-yaml',
  '.yml': 'require-yaml'
};

var register = {
  'babel/register': function (module, config) {
    module(config);
  },
  'node-jsx': function (module, config) {
    module.install(config);
  },
  'toml-require': function (module) {
    module.install();
  }
};

var legacyModules = {
  '.coffee': 'coffee-script',
  '.coffee.md': 'coffee-script',
  '.iced': 'iced-coffee-script',
  // .iced.md and .liticed weren't available before the register module
  '.litcoffee': 'coffee-script',
  // typescript-require is for versions of TypeScript before 1.4
  '.ts': 'typescript-require'
};

var configurations = {
  'babel/register': {
    // register on .js extension due to https://github.com/joyent/node/blob/v0.12.0/lib/module.js#L353
    // which only captures the final extension (.babel.js -> .js)
    extensions: '.js'
  },
  'node-jsx': {
    extension: '.jsx',
    harmony: true
  }
};

var jsVariantExtensions = [
  '.js',
  '.babel.js',
  '.cirru',
  '.cjsx',
  '.co',
  '.coffee',
  '.coffee.md',
  '.iced',
  '.iced.md',
  '.jsx',
  '.litcoffee',
  '.liticed',
  '.ls',
  '.ts',
  '.wisp'
];

module.exports = {
  extensions: extensions,
  legacy: legacyModules,
  configurations: configurations,
  register: register,
  jsVariants: jsVariantExtensions.reduce(function (result, ext) {
    result[ext] = extensions[ext];
    return result;
  }, {})
};
