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
      "<div id='ECForm' class='ec-form-wrapper'>" + 
        "<h2 class='h3 mt0'>Leave a comment</h2>" + 
        "<form class='p1 ec-form bg-darken-1'>" + 
          "<div class='ec-form-field mt1 mb2 px1' id='ECForm-text'><textarea class='field-light full-width' name='text' id='ECFormField'></textarea></div>" + 
          "<div class='clearfix mb1'>" + 
            "<div class='ec-form-field px1 col col-4' id='ECForm-author'><input class='field-light full-width' type='text' name='author' placeholder='name'></div>" +
            "<div class='ec-form-field px1 col col-4' id='ECForm-email'><input class='field-light full-width' type='email' name='email' placeholder='email'></div>" +
            "<div class='px1 col col-4'>" + 
              "<input class='button full-width' id='ECFormSubmit' type='submit' value='Submit comment'>" + 
            "</div>" +
          "</div>" +
        "</form>" + 
      "</div>"
    );
  }
};

Form.resize = function() {
  var formHeight = this.DOM.form.clientHeight;
  var margin = parseInt(window.getComputedStyle(this.DOM.form).marginBottom);
  var num = formHeight + margin + this.commentsList.height() + 20;
  this.iframe.style.height = num + "px"; 
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
  this.fields = this.DOM.form.getElementsByTagName("form")[0].elements;
  comment.init(this.fields["text"].value, this.fields["author"].value, this.fields["email"].value.trim(), new Date().toString());
  if (comment.validate()) {
    this.commentsList.comments.push(comment);
    this.commentsList.save();
    this.commentsList.render(this.DOM.form);
    this.clear();
  } else {
    this.showErrors(comment.errors);
  }
  this.resize();
};

Form.showErrors = function(errors) {
  errors.forEach(function(error) {
    var msg = this.doc.createElement("p");
    msg.innerHTML = error.message;
    msg.classList.add("red");
    msg.classList.add("mt1");
    msg.classList.add("h5");
    msg.classList.add("mb1");
    this.fields[error.field].parentNode.appendChild(msg)
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
