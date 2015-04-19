var EchoChamber = (function (window, undefined) {

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

  var Comment = {};

  Comment.init = function(text, author, email) {
    this.text = text;
    this.author = author;
    this.email = email;
  };

  var EchoChamber = window.EchoChamber || {};

  EchoChamber.init = function() {
    this.entry = document.getElementsByTagName('script')[0];
    this.templates = {
      form: function() {
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
      }
    };
    this.DOM = {};
    this.iframe = null;
    this.iframe = this.attachIframe(); 
    this.form = this.initDOM(this.iframe);
    this.commentsList = Object.create(CommentList);
    this.commentsList.init();
    this.addEventListeners();
  };

  EchoChamber.addEventListeners = function() {
    this.DOM.form.addEventListener('submit', _onClick.bind(this));
  };

  EchoChamber.loadStyleSheet = function(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    this.entry.parentNode.insertBefore(link, this.entry);
  }

  EchoChamber.attachIframe = function() {
    var iframe = document.createElement('iframe');
    iframe.style.width = '250px';
    iframe.style.height = '300px';
    iframe.style.border = 'none';
    this.entry.parentNode.insertBefore(iframe, this.entry);
    return iframe;
  }

  EchoChamber.initDOM = function(target) {
    this.doc = target.contentWindow.document;
    this.doc.write(this.templates.form());
    this.doc.close();
    this.DOM.form = this.doc.getElementById('ECForm');
    this.DOM.button = this.doc.getElementById('ECFormSubmit');
  };

  EchoChamber.submit = function(form) {
    var comment = Object.create(Comment);
    comment.init(form.elements["text"].value, form.elements["author"].value, form.elements["email"].value);
    this.commentsList.comments.push(comment);
    this.commentsList.save();
  }

  var _onClick = function(e) {
    e.preventDefault();
    this.submit(this.DOM.form);
  }

  var ec = Object.create(EchoChamber);
  ec.init();
  
  return ec;

})(window);
