/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

var expect = require('chai').expect;
var isObject = require('../');

it('when null is passed it should return false.', function () {
  expect(isObject(null)).to.eql(false);
});

it('when [] is passed it should return false.', function () {
  expect(isObject([])).to.eql(false);
});

it('when {} is passed it should return true.', function () {
  expect(isObject({})).to.eql(true);
});