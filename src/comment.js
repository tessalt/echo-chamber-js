var Comment = {};

Comment.init = function(text, author, email) {
  this.text = text;
  this.author = author;
  this.email = email;
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
      "<h4>" + this.author + "</h4>" +
      "<p>" + this.text + "</p>" +
    "</div>"
  );
};

module.exports = Comment;
