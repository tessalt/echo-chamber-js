var CommentList = {};

CommentList.init = function() {
  this.comments = [];
};

CommentList.save = function() {
  localStorage.setItem("comments", this.stringify());
};

CommentList.stringify = function() {
  return JSON.stringify(this.comments.map(function(item) {
    return {
      text: item.text,
      author: item.author,
      email: item.email,
      children: item.children
    }
  }));
};

module.exports = CommentList;
