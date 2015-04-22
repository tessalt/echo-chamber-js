require('./style.css');
var CommentList = require('./comment_list.js');
var Form = require('./form.js');

var App = {
  
  init: function () {
    this.entry = document.getElementsByTagName('script')[0];
   
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
        cssURL = 'http://widget.dev/main.css';
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
  var bgColor;
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].style['background-color'] = styles.anchorColor;
  }
};

var _getStyle = function(node, property) {
  var value;
  value = window.getComputedStyle(node, null).getPropertyValue(property);
  if (value === '' || value === 'transparent' || value === 'rgba(0,0,0,0)') {
    return getStyle(node.parentNode, property);
  } else {
    return value || '';
  }
};

var _getBasicStyles = function(container) {
  var anchor = document.createElement('a');
  container.appendChild(anchor);
  var styles = {
    anchorColor: _getStyle(anchor, 'color'),
    fontFamily: _getStyle(container, 'font-family').replace(/['"]/g, '')
  }
  anchor.parentNode.removeChild(anchor);
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
