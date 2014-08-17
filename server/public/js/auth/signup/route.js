var Ember = require('ember');

module.exports = Ember.Route.extend({
  redirect: function(transition) {
    if (this.get('session.user')) {
      return this.transitionTo('');
    }
  }
});
