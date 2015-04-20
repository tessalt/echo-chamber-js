var CommentList = require('./comment_list.js');
var Form = require('./form.js');
var EchoChamber = window.EchoChamber || {};

EchoChamber.init = function() {
  this.entry = document.getElementsByTagName('script')[0];
  this.iframe = this.attachIframe(); 
  this.form = Object.create(Form);
  this.form.init(this.iframe);
};

EchoChamber.attachIframe = function() {
  var iframe = document.createElement('iframe');
  iframe.style.width = '250px';
  iframe.style.height = '300px';
  iframe.style.border = 'none';
  this.entry.parentNode.insertBefore(iframe, this.entry);
  return iframe;
}

module.exports = EchoChamber;
