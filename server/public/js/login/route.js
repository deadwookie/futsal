var Ember = require('ember');

module.exports = Ember.Route.extend({
  beforeModel: function(transition) {
    if (this.get('auth').get('isAuthenticated')) {
      return this.transitionTo('me');
    }
  }
});
