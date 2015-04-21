md5 = require('../node_modules/js-md5');

var Comment = {};

Comment.init = function(text, author, email, timestamp) {
  this.text = text;
  this.author = author;
  this.email = email;
  this.timestamp = timestamp;
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
      "<p class='mb0'><small>" + _renderDate(this.timestamp) + "</small></p>" +
    "</div>"
  );
};

var _authorGravatar = function(email) {
  return "http://www.gravatar.com/avatar/" + _emailHash(email);
};

var _emailHash = function(email) {
  return md5(email);
};

var _renderDate = function(timestamp) {
  var date = new Date(timestamp);
  return date.toDateString() + " at " + date.getHours() + ":" + date.getMinutes(); 
};

module.exports = Comment;
