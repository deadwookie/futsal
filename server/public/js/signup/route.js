var Ember = require('ember');

module.exports = Ember.Route.extend({
  beforeModel: function(transition) {
    if (this.get('auth.user')) {
      return this.transitionTo('me');
    }
  }
});
