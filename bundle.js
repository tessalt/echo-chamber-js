(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Author = {

  init: function(name, email) {
    this.name = name;
    this.email = email;
  },
  
  gravatar: function() {
    return 'http://www.gravatar.com/avatar/' + _emailHash(this.email) + '?s=48';
  },

  save: function() {
    localStorage.setItem('author', JSON.stringify(this));
  },

  fetch: function() {
    var raw = localStorage.getItem('author') ? JSON.parse(localStorage.getItem('author')) : {name: "", email: ""};
    this.init(raw.name, raw.email);
  },

  validate: function() {
    var errors = [];
    ['name', 'email'].forEach(function(property) {
      if (!this[property]) {
        errors.push({
          field: property,
          message: 'Please enter ' + property
        });
      }
    }.bind(this));
    return errors;
  }
}

var _emailHash = function(email) {
  return md5(email);
};


module.exports = Author;

},{}],2:[function(require,module,exports){
md5 = require('./md5');

var Comment = {
  
  init: function(author, text, timestamp) {
    this.text = text;
    this.author = author;
    this.timestamp = timestamp;
    this.errors = [];
  },
  
  validate: function() {
    this.errors = this.author.validate();
    if (!this.text) {
      this.errors.push({
        field: 'text', 
        message: 'Please enter text' 
      });
    }
    return this.errors.length ? false : true;
  },

  render: function() {
    return (
      "<div class='ec-comment'>" + 
        "<div class='ec-comment__avatar'>" +
          "<img src='" + this.author.gravatar() + "'>" +
        "</div>" +
        "<div class='ec-comment__body'>" +
          "<h4 class=''>" + this.author.name  +
            "<small> on " + _renderDate(this.timestamp) + "</small>" +
          "</h4>" +
          "<p class=''>" + this.text + "</p>" +
        "</div>" +
      "</div>"
    );
  }
};

var _renderDate = function(timestamp) {
  var date = new Date(timestamp);
  return date.toDateString() + ' at ' + date.getHours() + ':' + date.getMinutes(); 
};

module.exports = Comment;

},{"./md5":6}],3:[function(require,module,exports){
var Comment = require('./comment.js');
var Author = require('./author.js');

var CommentList = {
  
  init: function (form, renderCallback) {
    var list = document.createElement('div');
    list.setAttribute('id', 'EC-list');
    list.setAttribute('class', 'ec-list');
    this.form = form;
    this.list = form.parentNode.appendChild(list);
    this.renderCallback = renderCallback;
    this.path = window.location.href; 
    this.comments = this.load();
    this.render();
  },

  load: function () {
    var rawComments = localStorage.getItem(this.path) || '[]';
    return _parse(JSON.parse(rawComments));
  },

  fetch: function () {
    var rawComments = localStorage.getItem(this.path) || '[]';
    return JSON.parse(rawComments);
  },

  save: function () {
    localStorage.setItem(this.path, this.stringify());
  },

  render: function (target) {
    var count = this.comments.length;
    this.list.innerHTML = this.buildHTML();
    this.form.firstChild.innerHTML = count + ' ' + _commentString(count);
  }, 

  stringify: function () {
    return JSON.stringify(this.comments.map(function(item) {
      return {
        text: item.text,
        name: item.author.name,
        email: item.author.email,
        timestamp: item.timestamp
      }
    }));
  },
  
  getHeight: function () {
    return this.list.clientHeight;
  },

  buildHTML: function () {
    var comments = this.comments.slice();
    return comments.reduce(function(total, comment) {
      return total + comment.render(); 
    }, '');
  }

}

var _commentString = function(count) {
  return count === 1 ? 'comment' : 'comments';
};

var _parse = function(srcComments) {
  return srcComments.map(function(comment) {
    var c = Object.create(Comment);
    var a = Object.create(Author);
    a.init(comment.name, comment.email);
    c.init(a, comment.text, comment.timestamp);
    return c;
  });
};

module.exports = CommentList;

},{"./author.js":1,"./comment.js":2}],4:[function(require,module,exports){
var CommentList = require('./comment_list.js');
var Form = require('./form.js');

var App = {
  
  init: function () {
    this.entry = document.getElementById('echochamber');
   
    this.attachIframe(); 
    this.iframeDoc = this.iframe.contentWindow.document;
    this.pageStyles = _getBasicStyles(this.entry.parentNode);
  
    this.form = Object.create(Form);
    this.form.init(this.iframe);
    this.loadStylesheet();
  },

  attachIframe: function () {
    this.iframe = document.createElement('iframe');
    this.iframe.style.width = '100%';
    this.iframe.style.overflow = 'hidden';
    this.iframe.style.border = "none";
    this.iframe.style.opacity = 0;
    this.iframe.scrolling = false;
    this.iframe.style.transition = "opacity .5s";
    this.iframe.setAttribute("horizontalscrolling", "no");
    this.iframe.setAttribute("verticalscrolling", "no");
    this.entry.parentNode.insertBefore(this.iframe, this.entry);
  }, 

  loadStylesheet: function () {
    var link   = document.createElement('link'),
        img    = document.createElement( "img" ),
        body   = document.body,
        head   = this.iframeDoc.getElementsByTagName('head')[0],
        cssURL = EchoChamber.host + '/main.css'; 
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = cssURL; 
    head.appendChild(link);
    body.appendChild(img);
    img.src = cssURL;
    img.onerror = function() {
      body.removeChild(img);
      _applyPageStyles(this.iframeDoc, this.pageStyles);
      this.iframe.style.opacity = 1;
      this.addEventListeners();
    }.bind(this);
  },

  addEventListeners: function () {
    var self = this;
    this.iframe.contentWindow.addEventListener('resize', _debounce(self.form.resize.bind(self.form)));
  }

};

var _applyPageStyles = function(doc, styles) {
  var body = doc.getElementsByTagName('body')[0];
  for (var property in styles) {
    if (!styles.hasOwnProperty(property)) {
      return;
    }
    body.style[property] = styles[property];
  }
  var buttons = doc.querySelectorAll(".button");
  var paragraphs = doc.getElementsByTagName('p');
  var bgColor;
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style['background-color'] = styles.anchorColor;
  }
};

var _getStyle = function(node, property) {
  var value;
  value = window.getComputedStyle(node, null).getPropertyValue(property);
  if (value === '' || value === 'transparent' || value === 'rgba(0,0,0,0)') {
    return _getStyle(node.parentNode, property);
  } else {
    return value || '';
  }
};

var _getBasicStyles = function(container) {
  var anchor = document.createElement('a');
  var paragraph = document.createElement('p');
  container.appendChild(anchor);
  container.appendChild(paragraph);
  var styles = {
    anchorColor: _getStyle(anchor, 'color'),
    paragraphColor: _getStyle(paragraph, 'color'),
    fontFamily: _getStyle(container, 'font-family').replace(/['"]/g, '')
  }
  anchor.parentNode.removeChild(anchor);
  paragraph.parentNode.removeChild(paragraph);
  return styles;
};

function _debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

module.exports = App;

},{"./comment_list.js":3,"./form.js":5}],5:[function(require,module,exports){
var CommentList = require('./comment_list.js');
var Comment = require('./comment.js');
var Author = require('./author.js');

var Form = {

  init: function (iframe) {
    this.iframe = iframe; 
    this.DOM = {};
    this.initDOM(this.iframe);
    this.fields = this.DOM.form.getElementsByTagName('form')[0].elements;
    this.commentsList = Object.create(CommentList);
    this.commentsList.init(this.DOM.form, this.renderCallback);
    this.author = Object.create(Author);
    this.author.fetch();
    this.addEventListeners();
    this.resize();
  },

  addEventListeners: function () {
    this.DOM.form.addEventListener('submit', this.onClick.bind(this));
    this.fields['text'].addEventListener('focus', this.onTextareaFocus.bind(this));
  },

  resize: function () {
    var formHeight = this.DOM.form.clientHeight;
    var margin = parseInt(window.getComputedStyle(this.DOM.form).marginBottom);
    var num = formHeight + margin + this.commentsList.getHeight() + 20;
    this.iframe.style.height = num + 'px'; 
  },

  initDOM: function () {
    this.doc = this.iframe.contentWindow.document;
    this.doc.write(_formTemplate);
    this.doc.close();
    this.DOM.form = this.doc.getElementById('ECForm');
    this.DOM.button = this.doc.getElementById('ECFormSubmit');
  },

  submit: function () {
    var comment = Object.create(Comment);
    this.author.init(this.fields['name'].value, this.fields['email'].value.trim());
    comment.init(this.author, this.fields['text'].value, new Date().toString());
    if (comment.validate()) {
      this.commentsList.comments.push(comment);
      this.commentsList.save();
      this.commentsList.render(this.DOM.form);
      this.author.save();
      this.clear();
    } else {
      this.showErrors(comment.errors);
    }
    this.resize();
  },

  showErrors: function (errors) {
    errors.forEach(function(error) {
      var msg = this.doc.createElement('p');
      msg.innerHTML = error.message;
      msg.classList.add('ec-error');
      this.fields[error.field].parentNode.appendChild(msg);
    }.bind(this));
  },

  onTextareaFocus: function (e) {
    var fields = this.DOM.form.querySelectorAll('.ec-form__fields');
    fields[0].style.display = 'block';
    ['name', 'email'].forEach(function(property) {
      this.fields[property].value = this.author[property] || '';
    }.bind(this));
    this.resize();
  },

  clear: function () {
    ['text', 'name', 'email'].forEach(function(field) {
      this.fields[field].value = '';
    }.bind(this));
  },

  onClick: function (e) {
    e.preventDefault();
    this.submit();
  }

};

var _formTemplate = 
  "<div id='ECForm' class='ec-form-wrapper'>" + 
    "<h2 class='ec-heading--2' id='ECFormHeading'></h2>" + 
    "<form class='ec-form'>" + 
      "<div class='ec-form__field' id='ECForm-text'>" +
        "<textarea class='' name='text' id='ECFormField' placeholder='Your comment...'>" +
        "</textarea>" + 
      "</div>" + 
      "<div class='ec-form__fields'>" + 
        "<div class='ec-form__field' id='ECForm-author'>" + 
          "<input class='' type='text' name='name' placeholder='Name'>" +
        "</div>" +
        "<div class='ec-form__field' id='ECForm-email'>" + 
          "<input class='' type='email' name='email' placeholder='Email'>" +
        "</div>" +
        "<div class=''>" + 
          "<input class='button' id='ECFormSubmit' type='submit' value='Submit comment'>" + 
        "</div>" + 
      "</div>" +
    "</form>" + 
  "</div>";

module.exports = Form;

},{"./author.js":1,"./comment.js":2,"./comment_list.js":3}],6:[function(require,module,exports){
var md5 = function (string) {

   function RotateLeft(lValue, iShiftBits) {
           return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
   }

   function AddUnsigned(lX,lY) {
           var lX4,lY4,lX8,lY8,lResult;
           lX8 = (lX & 0x80000000);
           lY8 = (lY & 0x80000000);
           lX4 = (lX & 0x40000000);
           lY4 = (lY & 0x40000000);
           lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
           if (lX4 & lY4) {
                   return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
           }
           if (lX4 | lY4) {
                   if (lResult & 0x40000000) {
                           return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
                   } else {
                           return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
                   }
           } else {
                   return (lResult ^ lX8 ^ lY8);
           }
   }

   function F(x,y,z) { return (x & y) | ((~x) & z); }
   function G(x,y,z) { return (x & z) | (y & (~z)); }
   function H(x,y,z) { return (x ^ y ^ z); }
   function I(x,y,z) { return (y ^ (x | (~z))); }

   function FF(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function GG(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function HH(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function II(a,b,c,d,x,s,ac) {
           a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
           return AddUnsigned(RotateLeft(a, s), b);
   };

   function ConvertToWordArray(string) {
           var lWordCount;
           var lMessageLength = string.length;
           var lNumberOfWords_temp1=lMessageLength + 8;
           var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
           var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
           var lWordArray=Array(lNumberOfWords-1);
           var lBytePosition = 0;
           var lByteCount = 0;
           while ( lByteCount < lMessageLength ) {
                   lWordCount = (lByteCount-(lByteCount % 4))/4;
                   lBytePosition = (lByteCount % 4)*8;
                   lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
                   lByteCount++;
           }
           lWordCount = (lByteCount-(lByteCount % 4))/4;
           lBytePosition = (lByteCount % 4)*8;
           lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
           lWordArray[lNumberOfWords-2] = lMessageLength<<3;
           lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
           return lWordArray;
   };

   function WordToHex(lValue) {
           var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
           for (lCount = 0;lCount<=3;lCount++) {
                   lByte = (lValue>>>(lCount*8)) & 255;
                   WordToHexValue_temp = "0" + lByte.toString(16);
                   WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
           }
           return WordToHexValue;
   };

   function Utf8Encode(string) {
           string = string.replace(/\r\n/g,"\n");
           var utftext = "";

           for (var n = 0; n < string.length; n++) {

                   var c = string.charCodeAt(n);

                   if (c < 128) {
                           utftext += String.fromCharCode(c);
                   }
                   else if((c > 127) && (c < 2048)) {
                           utftext += String.fromCharCode((c >> 6) | 192);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }
                   else {
                           utftext += String.fromCharCode((c >> 12) | 224);
                           utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                           utftext += String.fromCharCode((c & 63) | 128);
                   }

           }

           return utftext;
   };

   var x=Array();
   var k,AA,BB,CC,DD,a,b,c,d;
   var S11=7, S12=12, S13=17, S14=22;
   var S21=5, S22=9 , S23=14, S24=20;
   var S31=4, S32=11, S33=16, S34=23;
   var S41=6, S42=10, S43=15, S44=21;

   string = Utf8Encode(string);

   x = ConvertToWordArray(string);

   a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

   for (k=0;k<x.length;k+=16) {
           AA=a; BB=b; CC=c; DD=d;
           a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
           d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
           c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
           b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
           a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
           d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
           c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
           b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
           a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
           d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
           c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
           b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
           a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
           d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
           c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
           b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
           a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
           d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
           c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
           b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
           a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
           d=GG(d,a,b,c,x[k+10],S22,0x2441453);
           c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
           b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
           a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
           d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
           c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
           b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
           a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
           d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
           c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
           b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
           a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
           d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
           c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
           b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
           a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
           d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
           c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
           b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
           a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
           d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
           c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
           b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
           a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
           d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
           c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
           b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
           a=II(a,b,c,d,x[k+0], S41,0xF4292244);
           d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
           c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
           b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
           a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
           d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
           c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
           b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
           a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
           d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
           c=II(c,d,a,b,x[k+6], S43,0xA3014314);
           b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
           a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
           d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
           c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
           b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
           a=AddUnsigned(a,AA);
           b=AddUnsigned(b,BB);
           c=AddUnsigned(c,CC);
           d=AddUnsigned(d,DD);
   		}

   	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

   	return temp.toLowerCase();
}

module.exports = md5;

},{}],7:[function(require,module,exports){
var EchoChamber = (function (window, undefined) {

  var EchoChamber = window.EchoChamber || {};

  var hosts = {
    local: 'http://widget.dev/src',
    prod: 'https://s3.amazonaws.com/echochamberjs/dist'
  }

  EchoChamber.host = hosts.local;
  EchoChamber.App = require('./src/echo_chamber.js'); 

  var app = Object.create(EchoChamber.App);
  app.init();
  
  return app;

})(window);

},{"./src/echo_chamber.js":4}]},{},[7]);
