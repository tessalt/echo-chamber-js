# interpret
> A dictionary of file extensions and associated module loaders.

[![NPM](https://nodei.co/npm/interpret.png)](https://nodei.co/npm/interpret/)

## What is it
This is used by [Liftoff](http://github.com/tkellen/node-liftoff) to automatically require dependencies for configuration files, and by [rechoir](http://github.com/tkellen/node-rechoir) for registering module loaders.

## API

### extensions
Map file types to modules which provide a [require.extensions] loader.
```js
{
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
  '.toml': 'toml-require',
  '.ts': 'typescript-register',
  '.wisp': 'wisp/engine/node',
  '.xml': 'require-xml',
  '.yaml': 'require-yaml',
  '.yml': 'require-yaml'
}
```

### legacy
Check here to see if a legacy module should be loaded upon failure to load the main module.  If a legacy module is available
it is recommended to use `try/catch` around the `require`s to avoid crashing the process upon failure to load the main module.
```js
{
  '.coffee': 'coffee-script' // old versions of coffee-script didn't have the `register` module
}
```

### register
Check here to see if setup is needed for the module register itself with [require.extensions].  If a method is returned, call it with the module.
```js
{
  'toml-require': function (module) {
    module.install();
  }
}
```

### configurations
These configuration options should be passed into any `register` function with the same key.
```js
// configurations
{
  'node-jsx': {
    extension: '.jsx',
    harmony: true
  }
}
// register
{
  'node-jsx': function (module, config) {
    module.install(config);
  }
}
```

### jsVariants
Extensions which are javascript variants.

```js
{
  '.js': null,
  '.babel.js': 'babel/register',
  '.cirru': 'cirru-script/lib/register',
  '.cjsx': 'node-cjsx/register',
  '.co': 'coco',
  '.coffee': 'coffee-script/register',
  '.coffee.md': 'coffee-script/register',
  '.iced': 'iced-coffee-script/register',
  '.iced.md': 'iced-coffee-script/register',
  '.jsx': 'node-jsx',
  '.litcoffee': 'coffee-script/register',
  '.liticed': 'iced-coffee-script/register',
  '.ls': 'LiveScript',
  '.ts': 'typescript-register',
  '.wisp': 'wisp/engine/node'
}
```

[require.extensions]: http://nodejs.org/api/globals.html#globals_require_extensions


### Example Usage
```js
const interpret = require('interpret');
const path = require('path');
const resolve = require('resolve');

// register support for a defined extension
function register(filepath, cwd) {
  // find the extension of the requested filename
  var ext = path.extname(filepath);
  // see if this extension is already supported
  if (Object.keys(require.extensions).indexOf(ext) !== -1) {
    return;
  }
  // if no cwd is specified, assume we want to use the
  // directory the requested file exists in
  if (!cwd) {
    cwd = path.dirname(path.resolve(filepath));
  }
  // find out which module is needed to read this extension
  var moduleName = interpret.extensions[ext];
  // if a module exists for this extension, make it usable
  if (moduleName) {
    // find the module relative to cwd that can add support for this extension
    // optionally deal with legacy modules here
    var module = resolve.sync(moduleName, {basedir: cwd});
    // require it
    var compiler = require(module);
    // see if there is a method needed beyond requiring to enable support
    var register = interpret.register[moduleName];
    var config = interpret.configurations[moduleName];
    // if there is, run it
    if (register) {
      register(compiler, config);
    }
  }
}
```

Note: this is more or less exactly how [rechoir](http://github.com/tkellen/node-rechoir) works.
