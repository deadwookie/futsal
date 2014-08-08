var Ember = require('ember');

module.exports = Ember.Route.extend({
  model: function(params) {
    var currentUser = this.get('auth').get('currentUser');
    return currentUser ? this.store.find('player', currentUser.id) : null;
  }
});
