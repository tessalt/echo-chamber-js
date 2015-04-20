var CommentList = {};
var Comment = require('./comment.js');

CommentList.init = function(form) {
  var list = document.createElement("div");
  list.setAttribute("id", "EC-list");
  this.list = form.parentNode.appendChild(list);
  this.comments = this.load();
  this.render();
};

CommentList.load = function() {
  var srcComments = _fetch();
  return _parse(srcComments);
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
  var comments = this.comments.slice();
  return comments.reverse().reduce(function(total, comment) {
    return total + comment.render(); 
  }, '');
};

var _fetch = function() {
  var rawComments = localStorage.getItem("comments") || "[]";
  return JSON.parse(rawComments);
};

var _parse = function(srcComments) {
  return srcComments.map(function(comment) {
    var c = Object.create(Comment);
    c.init(comment.text, comment.author, comment.email);
    return c;
  });
};

module.exports = CommentList;
