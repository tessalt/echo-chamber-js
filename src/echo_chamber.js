require('./style.css');
var CommentList = require('./comment_list.js');
var Form = require('./form.js');
var EchoChamber = window.EchoChamber || {};

EchoChamber.init = function() {
  this.entry = document.getElementsByTagName('script')[0];
  this.iframe = this.attachIframe(); 
  this.form = Object.create(Form);
  this.form.init(this.iframe);
  this.loadStylesheet();
};

EchoChamber.attachIframe = function() {
  var iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.overflow = 'hidden';
  iframe.style.border = "none";
  iframe.scrolling = false;
  iframe.setAttribute("horizontalscrolling", "no");
  iframe.setAttribute("verticalscrolling", "no");
  this.entry.parentNode.insertBefore(iframe, this.entry);
  return iframe;
};

EchoChamber.loadStylesheet = function() {
  var link = document.createElement('link');
  var img = document.createElement( "img" );
  var body = document.body;
  var head = this.iframe.contentWindow.document.children[0].children[0];
  var cssURL = 'http://widget.dev/main.css';
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = cssURL; 
  head.appendChild(link);
  body.appendChild(img);
  img.src = cssURL;
  img.onerror = function() {
    this.form.resize();
    body.removeChild(img);
  }.bind(this);
};

module.exports = EchoChamber;
