var Comment = require('./comment.js');

var CommentList = {
  
  init: function (form) {
    var list = document.createElement("div");
    list.setAttribute("id", "EC-list");
    this.list = form.parentNode.appendChild(list);
    this.path = window.location.href; 
    this.comments = this.load();
    this.render();
  },

  load: function () {
    var rawComments = localStorage.getItem(this.path) || "[]";
    return _parse(JSON.parse(rawComments));
  },

  fetch: function () {
    var rawComments = localStorage.getItem(this.path) || "[]";
    return JSON.parse(rawComments);
  },

  save: function () {
    localStorage.setItem(this.path, this.stringify());
  },

  render: function (target) {
    var count = this.comments.length;
    this.listHeader = "<h3 class='mt0 mb0'>" + count + " " + _commentString(count)  + "</h3>";
    this.list.innerHTML = this.listHeader + this.buildHTML();
  }, 

  stringify: function () {
    return JSON.stringify(this.comments.map(function(item) {
      return {
        text: item.text,
        author: item.author,
        email: item.email,
        timestamp: item.timestamp
      }
    }));
  },
  
  getHeight: function () {
    return this.list.clientHeight;
  },

  buildHTML: function () {
    var comments = this.comments.slice();
    return comments.reverse().reduce(function(total, comment) {
      return total + comment.render(); 
    }, '');
  }

}

var _commentString = function(count) {
  return count > 1 ? 'comments' : 'comment';
};

var _parse = function(srcComments) {
  return srcComments.map(function(comment) {
    var c = Object.create(Comment);
    c.init(comment.text, comment.author, comment.email, comment.timestamp);
    return c;
  });
};

module.exports = CommentList;
