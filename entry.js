var EchoChamber = (function (window, undefined) {

  var EchoChamber = window.EchoChamber || {};

  var hosts = {
    local: 'http://widget.dev/src',
    prod: 'https://s3.amazonaws.com/echochamberjs/dist'
  }

  EchoChamber.host = hosts.prod;
  EchoChamber.App = require('./src/echo_chamber.js'); 

  var app = Object.create(EchoChamber.App);
  app.init();
  
  return app;

})(window);
