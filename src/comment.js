md5 = require('../node_modules/js-md5');

var Comment = {};

Comment.init = function(text, author, email) {
  this.text = text;
  this.author = author;
  this.email = email;
  this.timestamp = new Date().toDateString();
  this.errors = [];
};

Comment.validate = function() {
  ['text', 'author', 'email'].forEach(function(property) {
    if (!this[property]) {
      this.errors.push({
        field: property,
        message: "Please enter " + property
      });
    }
  }.bind(this));
  return this.errors.length ? false : true;
};

Comment.render = function() {
  return (
    "<div class='ec-comment'>" + 
     "<img src='" + _authorGravatar(this.email) + "'>" +
      "<h4>" + this.author + "</h4>" +
      "<p>" + this.text + "</p>" +
      "<p><small>" + this.timestamp + "</small></p>" +
    "</div>"
  );
};

var _authorGravatar = function(email) {
  var hash = _emailHash(email);
  var src = "http://www.gravatar.com/avatar/" + hash;
  return src;
};

var _emailHash = function(email) {
  return md5(email);
};

module.exports = Comment;
