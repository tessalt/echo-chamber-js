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
  iframe.style.border = 'none';
  iframe.style.overflow = 'hidden';
  iframe.scrolling = false;
  iframe.setAttribute("horizontalscrolling", "no");
  iframe.setAttribute("verticalscrolling", "no");
  this.entry.parentNode.insertBefore(iframe, this.entry);
  return iframe;
};

EchoChamber.loadStylesheet = function() {
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'http://widget.dev/style.css';
  var head = this.iframe.contentWindow.document.children[0].children[0];
  head.appendChild(link);
};

module.exports = EchoChamber;
