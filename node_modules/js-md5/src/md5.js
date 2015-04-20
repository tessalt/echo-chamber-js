/*
 * js-md5 v0.3.0
 * https://github.com/emn178/js-md5
 *
 * Copyright 2014-2015, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */
;(function(root, undefined) {
  'use strict';

  var NODE_JS = typeof(module) != 'undefined';
  if(NODE_JS) {
    root = global;
    if(root.JS_MD5_TEST) {
      root.navigator = { userAgent: 'Firefox'};
    }
  }
  var FIREFOX = (root.JS_MD5_TEST || !NODE_JS) && navigator.userAgent.indexOf('Firefox') != -1;
  var ARRAY_BUFFER = !root.JS_MD5_TEST && typeof(ArrayBuffer) != 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [128, 32768, 8388608, -2147483648];
  var SHIFT = [0, 8, 16, 24];

  var blocks = [], buffer8;
  if(ARRAY_BUFFER) {
    var buffer = new ArrayBuffer(68);
    buffer8 = new Uint8Array(buffer);
    blocks = new Uint32Array(buffer);
  }

  var md5 = function(message) {
    var notString = typeof(message) != 'string';
    if(notString && message.constructor == ArrayBuffer) {
      message = new Uint8Array(message);
    }

    var h0, h1, h2, h3, a, b, c, d, bc, da, code, first = true, end = false,
        index = 0, i, start = 0, bytes = 0, length = message.length;
    blocks[16] = 0;
    do {
      blocks[0] = blocks[16];
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      if(notString) {
        if(ARRAY_BUFFER) {
          for (i = start;index < length && i < 64; ++index) {
            buffer8[i++] = message[index];
          }
        } else {
          for (i = start;index < length && i < 64; ++index) {
            blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
          }
        }
      } else {
        if(ARRAY_BUFFER) {
          for (i = start;index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              buffer8[i++] = code;
            } else if (code < 0x800) {
              buffer8[i++] = 0xc0 | (code >> 6);
              buffer8[i++] = 0x80 | (code & 0x3f);
            } else if (code < 0xd800 || code >= 0xe000) {
              buffer8[i++] = 0xe0 | (code >> 12);
              buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
              buffer8[i++] = 0x80 | (code & 0x3f);
            } else {
              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
              buffer8[i++] = 0xf0 | (code >> 18);
              buffer8[i++] = 0x80 | ((code >> 12) & 0x3f);
              buffer8[i++] = 0x80 | ((code >> 6) & 0x3f);
              buffer8[i++] = 0x80 | (code & 0x3f);
            }
          }
        } else {
          for (i = start;index < length && i < 64; ++index) {
            code = message.charCodeAt(index);
            if (code < 0x80) {
              blocks[i >> 2] |= code << SHIFT[i++ & 3];
            } else if (code < 0x800) {
              blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            } else if (code < 0xd800 || code >= 0xe000) {
              blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            } else {
              code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
              blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
              blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
            }
          }
        }
      }
      bytes += i - start;
      start = i - 64;
      if(index == length) {
        blocks[i >> 2] |= EXTRA[i & 3];
        ++index;
      }
      if(index > length && i < 56) {
        blocks[14] = bytes << 3;
        end = true;
      }
      
      if(first) {
        a = blocks[0] - 680876937;
        a = (a << 7 | a >>> 25) - 271733879 << 0;
        d = (-1732584194 ^ a & 2004318071) + blocks[1] - 117830708;
        d = (d << 12 | d >>> 20) + a << 0;
        c = (-271733879 ^ (d & (a ^ -271733879))) + blocks[2] - 1126478375;
        c = (c << 17 | c >>> 15) + d << 0;
        b = (a ^ (c & (d ^ a))) + blocks[3] - 1316259209;
        b = (b << 22 | b >>> 10) + c << 0;
      } else {
        a = h0;
        b = h1;
        c = h2;
        d = h3;
        a += (d ^ (b & (c ^ d))) + blocks[0] - 680876936;
        a = (a << 7 | a >>> 25) + b << 0;
        d += (c ^ (a & (b ^ c))) + blocks[1] - 389564586;
        d = (d << 12 | d >>> 20) + a << 0;
        c += (b ^ (d & (a ^ b))) + blocks[2] + 606105819;
        c = (c << 17 | c >>> 15) + d << 0;
        b += (a ^ (c & (d ^ a))) + blocks[3] - 1044525330;
        b = (b << 22 | b >>> 10) + c << 0;
      }

      a += (d ^ (b & (c ^ d))) + blocks[4] - 176418897;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[5] + 1200080426;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[6] - 1473231341;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[7] - 45705983;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ (b & (c ^ d))) + blocks[8] + 1770035416;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[9] - 1958414417;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[10] - 42063;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[11] - 1990404162;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (d ^ (b & (c ^ d))) + blocks[12] + 1804603682;
      a = (a << 7 | a >>> 25) + b << 0;
      d += (c ^ (a & (b ^ c))) + blocks[13] - 40341101;
      d = (d << 12 | d >>> 20) + a << 0;
      c += (b ^ (d & (a ^ b))) + blocks[14] - 1502002290;
      c = (c << 17 | c >>> 15) + d << 0;
      b += (a ^ (c & (d ^ a))) + blocks[15] + 1236535329;
      b = (b << 22 | b >>> 10) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[1] - 165796510;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[6] - 1069501632;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[11] + 643717713;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[0] - 373897302;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[5] - 701558691;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[10] + 38016083;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[15] - 660478335;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[4] - 405537848;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[9] + 568446438;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[14] - 1019803690;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[3] - 187363961;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[8] + 1163531501;
      b = (b << 20 | b >>> 12) + c << 0;
      a += (c ^ (d & (b ^ c))) + blocks[13] - 1444681467;
      a = (a << 5 | a >>> 27) + b << 0;
      d += (b ^ (c & (a ^ b))) + blocks[2] - 51403784;
      d = (d << 9 | d >>> 23) + a << 0;
      c += (a ^ (b & (d ^ a))) + blocks[7] + 1735328473;
      c = (c << 14 | c >>> 18) + d << 0;
      b += (d ^ (a & (c ^ d))) + blocks[12] - 1926607734;
      b = (b << 20 | b >>> 12) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[5] - 378558;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[8] - 2022574463;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[11] + 1839030562;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[14] - 35309556;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[1] - 1530992060;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[4] + 1272893353;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[7] - 155497632;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[10] - 1094730640;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[13] + 681279174;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[0] - 358537222;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[3] - 722521979;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[6] + 76029189;
      b = (b << 23 | b >>> 9) + c << 0;
      bc = b ^ c;
      a += (bc ^ d) + blocks[9] - 640364487;
      a = (a << 4 | a >>> 28) + b << 0;
      d += (bc ^ a) + blocks[12] - 421815835;
      d = (d << 11 | d >>> 21) + a << 0;
      da = d ^ a;
      c += (da ^ b) + blocks[15] + 530742520;
      c = (c << 16 | c >>> 16) + d << 0;
      b += (da ^ c) + blocks[2] - 995338651;
      b = (b << 23 | b >>> 9) + c << 0;
      a += (c ^ (b | ~d)) + blocks[0] - 198630844;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[7] + 1126891415;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[14] - 1416354905;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[5] - 57434055;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[12] + 1700485571;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[3] - 1894986606;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[10] - 1051523;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[1] - 2054922799;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[8] + 1873313359;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[15] - 30611744;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[6] - 1560198380;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[13] + 1309151649;
      b = (b << 21 | b >>> 11) + c << 0;
      a += (c ^ (b | ~d)) + blocks[4] - 145523070;
      a = (a << 6 | a >>> 26) + b << 0;
      d += (b ^ (a | ~c)) + blocks[11] - 1120210379;
      d = (d << 10 | d >>> 22) + a << 0;
      c += (a ^ (d | ~b)) + blocks[2] + 718787259;
      c = (c << 15 | c >>> 17) + d << 0;
      b += (d ^ (c | ~a)) + blocks[9] - 343485551;
      b = (b << 21 | b >>> 11) + c << 0;

      if(first) {
        h0 = a + 1732584193 << 0;
        h1 = b - 271733879 << 0;
        h2 = c - 1732584194 << 0;
        h3 = d + 271733878 << 0;
        first = false;
      } else {
        h0 = h0 + a << 0;
        h1 = h1 + b << 0;
        h2 = h2 + c << 0;
        h3 = h3 + d << 0;
      }
    } while(!end);

    if(FIREFOX) {
      var hex = HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F];
      hex += HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F];
      hex += HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F];
      hex += HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F];
      hex += HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F];
      hex += HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F];
      hex += HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F];
      hex += HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F];
      hex += HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F];
      hex += HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F];
      hex += HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F];
      hex += HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F];
      hex += HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F];
      hex += HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F];
      hex += HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F];
      hex += HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
      return hex;
    } else {
      return HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
         HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
         HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
         HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
         HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
         HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
         HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
         HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
         HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
         HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
         HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
         HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
         HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
         HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
         HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
         HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F];
    }
  };

  if(!root.JS_MD5_TEST && NODE_JS) {
    var crypto = require('crypto');
    var Buffer = require('buffer').Buffer;

    module.exports = function(message) {
      if(typeof(message) == 'string') {
        if(message.length <= 80) {
          return md5(message);
        } else if(message.length <= 183 && !/[^\x00-\x7F]/.test(message)) {
          return md5(message);
        }
        return crypto.createHash('md5').update(message, 'utf8').digest('hex');
      }
      if(message.constructor == ArrayBuffer) {
        message = new Uint8Array(message);
      }
      if(message.length <= 370) {
        return md5(message);
      }
      return crypto.createHash('md5').update(new Buffer(message)).digest('hex');
    };
  } else if(root) {
    root.md5 = md5;
  }
}(this));
