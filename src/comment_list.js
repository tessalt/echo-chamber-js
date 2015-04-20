var CommentList = {};

CommentList.init = function(form) {
  this.comments = [];
  var list = document.createElement("div");
  this.list = form.parentNode.appendChild(list);
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

CommentList.render = function(target) {
  this.list.innerHTML = this.buildHTML();
};

CommentList.buildHTML = function() {
  return this.comments.reduce(function(total, comment) {
    return total + comment.render(); 
  }, '');
};

module.exports = CommentList;
