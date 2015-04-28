var Comment = require('./comment.js');

var CommentList = {
  
  init: function (form, renderCallback) {
    var list = document.createElement("div");
    list.setAttribute("id", "EC-list");
    list.setAttribute("class", "ec-list");
    this.form = form;
    this.list = form.parentNode.appendChild(list);
    this.renderCallback = renderCallback;
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
    this.list.innerHTML = this.buildHTML();
    this.form.firstChild.innerHTML = count + " " + _commentString(count);
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
    return comments.reduce(function(total, comment) {
      return total + comment.render(); 
    }, '');
  }

}

var _commentString = function(count) {
  return count === 1 ? 'comment' : 'comments';
};

var _parse = function(srcComments) {
  return srcComments.map(function(comment) {
    var c = Object.create(Comment);
    c.init(comment.text, comment.author, comment.email, comment.timestamp);
    return c;
  });
};

module.exports = CommentList;
