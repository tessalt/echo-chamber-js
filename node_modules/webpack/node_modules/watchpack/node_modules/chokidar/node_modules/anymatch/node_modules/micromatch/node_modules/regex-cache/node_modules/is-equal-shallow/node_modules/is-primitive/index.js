/*!
 * is-primitive <https://github.com/jonschlinkert/is-primitive>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

// see http://jsperf.com/testing-value-is-primitive/5
module.exports = function isPrimitive(value) {
  switch (typeof value) {
    case "string":
    case "number":
    case "boolean":
    case "symbol":
      return true;
    }

  return value == null;
};
