var CommentList = require('./comment_list.js');
var Comment = require('./comment.js');
var Form = {};

Form.init = function(iframe) {
  this.iframe = iframe; 
  this.DOM = {};
  this.fields = {};
  this.initDOM(this.iframe);
  this.commentsList = Object.create(CommentList);
  this.commentsList.init(this.DOM.form);
  this.addEventListeners();
  this.resize();
}

Form.template = {
  form: function() {
    return (
      "<div class='ec-form-wrapper'>" + 
        "<form id='ECForm' class='ec-form'>" + 
          "<div class='ec-form-field' id='ECForm-author'><input type='text' name='author' placeholder='name'></div>" +
          "<div class='ec-form-field' id='ECForm-email'><input type='email' name='email' placeholder='email'></div>" +
          "<div class='ec-form-field' id='ECForm-text'><textarea name='text' id='ECFormField'></textarea></div>" + 
          "<input id='ECFormSubmit' type='submit' value='submit'>" + 
        "</form>" + 
      "</div>"
    );
  }
};

Form.resize = function() {
};

Form.addEventListeners = function() {
  this.DOM.form.addEventListener('submit', _onClick.bind(this));
};

Form.initDOM = function(target) {
  this.doc = target.contentWindow.document;
  this.doc.write(this.template.form());
  this.doc.close();
  this.DOM.form = this.doc.getElementById('ECForm');
  this.DOM.button = this.doc.getElementById('ECFormSubmit');
};

Form.submit = function() {
  var comment = Object.create(Comment);
  this.fields = this.DOM.form.elements;
  comment.init(this.fields["text"].value, this.fields["author"].value, this.fields["email"].value);
  if (comment.validate()) {
    this.commentsList.comments.push(comment);
    this.commentsList.save();
    this.commentsList.render(this.DOM.form);
    this.clear();
  } else {
    this.showErrors(comment.errors);
  }
};

Form.showErrors = function(errors) {
  errors.forEach(function(error) {
    var msg = this.doc.createElement("p");
    msg.innerHTML = error.message;
    this.DOM.form.elements[error.field].parentNode.appendChild(msg)
  }.bind(this));
};

Form.clear = function() {
  ["text", "author", "email"].forEach(function(field) {
    this.fields[field].value = '';
  }.bind(this));
};

var _onClick = function(e) {
  e.preventDefault();
  this.submit();
}

module.exports = Form;
