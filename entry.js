var EchoChamber = (function (window, undefined) {

  var EchoChamber = window.EchoChamber || {};
 
  EchoChamber.App = require('./src/echo_chamber.js'); 

  var app = Object.create(EchoChamber.App);
  app.init();
  
  return app;

})(window);
