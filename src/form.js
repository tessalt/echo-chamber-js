var CommentList = require('./comment_list.js');
var Comment = require('./comment.js');

var Form = {};

Form.init = function(iframe) {
  this.iframe = iframe; 
  this.DOM = {};
  this.initDOM(this.iframe);
  this.commentsList = Object.create(CommentList);
  this.commentsList.init();
  this.addEventListeners();
}

Form.template = function() {
  return (
    "<div class='ec-form-wrapper'>" + 
      "<form id='ECForm' class='ec-form'>" + 
        "<input type='text' name='author' placeholder='name'>" +
        "<input type='email' name='email' placeholder='email'>" +
        "<textarea name='text' id='ECFormField'></textarea>" + 
        "<input id='ECFormSubmit' type='submit' value='submit'>" + 
      "</form>" + 
    "</div>"
  );
};

Form.addEventListeners = function() {
  this.DOM.form.addEventListener('submit', _onClick.bind(this));
};

Form.initDOM = function(target) {
  this.doc = target.contentWindow.document;
  this.doc.write(this.template());
  this.doc.close();
  this.DOM.form = this.doc.getElementById('ECForm');
  this.DOM.button = this.doc.getElementById('ECFormSubmit');
};

Form.submit = function(form) {
  var comment = Object.create(Comment);
  comment.init(form.elements["text"].value, form.elements["author"].value, form.elements["email"].value);
  this.commentsList.comments.push(comment);
  this.commentsList.save();
}

var _onClick = function(e) {
  e.preventDefault();
  this.submit(this.DOM.form);
}

module.exports = Form;
