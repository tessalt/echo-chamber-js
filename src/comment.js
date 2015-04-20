  var Comment = {};

  Comment.init = function(text, author, email) {
    this.text = text;
    this.author = author;
    this.email = email;
  };

  var EchoChamber = window.EchoChamber || {};

  module.exports = Comment;
