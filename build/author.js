var Author = {

  init: function(name, email) {
    this.name = name;
    this.email = email;
  },
  
  gravatar: function() {
    return 'http://www.gravatar.com/avatar/' + _emailHash(this.email) + '?s=48';
  },

  save: function() {
    localStorage.setItem('author', JSON.stringify(this));
  },

  fetch: function() {
    var raw = localStorage.getItem('author') ? JSON.parse(localStorage.getItem('author')) : {name: "", email: ""};
    this.init(raw.name, raw.email);
  },

  validate: function() {
    var errors = [];
    ['name', 'email'].forEach(function(property) {
      if (!this[property]) {
        errors.push({
          field: property,
          message: 'Please enter ' + property
        });
      }
    }.bind(this));
    return errors;
  }
}

var _emailHash = function(email) {
  return md5(email);
};


module.exports = Author;
