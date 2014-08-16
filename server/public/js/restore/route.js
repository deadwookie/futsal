var Ember = require('ember');

module.exports = Ember.Route.extend({
  beforeModel: function(transition) {
    if (this.get('auth.user')) {
      // just redirect to profile
      return this.transitionTo('me');
    }
  }
});
