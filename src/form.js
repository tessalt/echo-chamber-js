var CommentList = require('./comment_list.js');
var Comment = require('./comment.js');

var Form = {

  init: function (iframe) {
    console.log('form init');
    this.iframe = iframe; 
    this.DOM = {};
    this.fields = {};
    this.initDOM(this.iframe);
    this.commentsList = Object.create(CommentList);
    this.commentsList.init(this.DOM.form, this.renderCallback);
    this.addEventListeners();
    this.resize();
  },

  addEventListeners: function () {
    this.DOM.form.addEventListener('submit', this.onClick.bind(this));
  },

  resize: function () {
    var formHeight = this.DOM.form.clientHeight;
    var margin = parseInt(window.getComputedStyle(this.DOM.form).marginBottom);
    var num = formHeight + margin + this.commentsList.getHeight() + 20;
    this.iframe.style.height = num + "px"; 
  },

  initDOM: function () {
    console.log('initdom called');
    this.doc = this.iframe.contentWindow.document;
    this.doc.write(_formTemplate);
    this.doc.close();
    this.DOM.form = this.doc.getElementById('ECForm');
    this.DOM.button = this.doc.getElementById('ECFormSubmit');
  },

  submit: function () {
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
  },

  showErrors: function (errors) {
    errors.forEach(function(error) {
      var msg = this.doc.createElement("p");
      msg.innerHTML = error.message;
      msg.classList.add("red");
      msg.classList.add("mt1");
      msg.classList.add("h5");
      msg.classList.add("mb1");
      this.fields[error.field].parentNode.appendChild(msg)
    }.bind(this));
  },

  clear: function () {
    ["text", "author", "email"].forEach(function(field) {
      this.fields[field].value = '';
    }.bind(this));
  },

  renderCallback: function (count) {
    console.log(this);
  },

  onClick: function (e) {
    e.preventDefault();
    this.submit();
  }

};

var _formTemplate = 
  "<div id='ECForm' class='ec-form-wrapper'>" + 
    "<h2 class='ec-heading--2' id='ECFormHeading'></h2>" + 
    "<form class=ec-form'>" + 
      "<div class='ec-form__field' id='ECForm-text'><textarea class='' name='text' id='ECFormField'></textarea></div>" + 
      "<div class='ec-form__fields'>" + 
        "<div class='ec-form__field' id='ECForm-author'><input class='' type='text' name='author' placeholder='name'></div>" +
        "<div class='ec-form__field' id='ECForm-email'><input class='' type='email' name='email' placeholder='email'></div>" +
        "<input class='button' id='ECFormSubmit' type='submit' value='Submit comment'>" + 
      "</div>" +
    "</form>" + 
  "</div>";

module.exports = Form;
