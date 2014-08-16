var Ember = require('ember');

module.exports = Ember.Route.extend({
  model: function() {
    var user = this.get('auth.user');
    return user ? this.store.find('player', user.id) : Ember.Object.create();
  },

  beforeModel: function() {
    // lets try to _loginActiveSession
    return this.get('auth').login();
  }
});
