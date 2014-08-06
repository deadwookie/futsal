var Ember = require('ember');

module.exports = Ember.Route.extend({
  model: function(params) {
    // return this.store.find('player', this.get('currentUserId'));
    return this.get('auth').get('currentUser') ? this.store.find('player', this.get('auth').get('currentUser')) : null;
  },

  actions: {
    logout: function() {
      return this.get('auth').logout();
    }
  }
});
