var Ember = require('ember');

module.exports = Ember.Route.extend({
  model: function(params) {
    var userId = this.get('auth').get('currentUser.id');
    return userId ? this.store.find('player', userId) : null;
  }
});
