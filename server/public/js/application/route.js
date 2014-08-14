var Ember = require('ember');

module.exports = Ember.Route.extend({
  model: function() {
    var currentUser = this.get('auth').get('currentUser');
    return currentUser ? this.store.find('player', currentUser.id) : Ember.Object.create();
  },

  beforeModel: function() {
    // lets try to _loginActiveSession
    return this.get('auth').login();
  }
});
