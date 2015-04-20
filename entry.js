var EchoChamber = (function (window, undefined) {

  var EchoChamber = require('./src/echo_chamber.js'); 

  var ec = Object.create(EchoChamber);
  ec.init();
  
  return ec;

})(window);
