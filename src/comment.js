var Comment = {};

Comment.init = function(text, author, email) {
  this.text = text;
  this.author = author;
  this.email = email;
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
