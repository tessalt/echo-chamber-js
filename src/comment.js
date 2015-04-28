md5 = require('../node_modules/js-md5');

var Comment = {
  
  init: function(text, author, email, timestamp) {
    this.text = text;
    this.author = author;
    this.email = email;
    this.timestamp = timestamp;
    this.errors = [];
  },
  
  validate: function(text, author, email, timestamp) {
    ['text', 'author', 'email'].forEach(function(property) {
      if (!this[property]) {
        this.errors.push({
          field: property,
          message: "Please enter " + property
        });
      }
    }.bind(this));
    return this.errors.length ? false : true;
  },

  render: function() {
    return (
      "<div class='ec-comment'>" + 
        "<div class='ec-comment__avatar'>" +
          "<img src='" + _authorGravatar(this.email) + "'>" +
        "</div>" +
        "<div class='ec-comment__body'>" +
          "<h4 class=''>" + this.author  +
            "<small> on " + _renderDate(this.timestamp) + "</small>" +
          "</h4>" +
          "<p class=''>" + this.text + "</p>" +
        "</div>" +
      "</div>"
    );
  }
};

var _authorGravatar = function(email) {
  return "http://www.gravatar.com/avatar/" + _emailHash(email) + "?s=48";
};

var _emailHash = function(email) {
  return md5(email);
};

var _renderDate = function(timestamp) {
  var date = new Date(timestamp);
  return date.toDateString() + " at " + date.getHours() + ":" + date.getMinutes(); 
};

module.exports = Comment;
