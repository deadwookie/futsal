var Ember = require('ember');

module.exports = Ember.Route.extend({
  beforeModel: function() {
    // lets try to _loginActiveSession
    return this.get('auth').login();
  }
});
