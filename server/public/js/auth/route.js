var Ember = require('ember');

module.exports = Ember.Route.extend({
  beforeModel: function() {
    this.transitionTo('auth.login');
  }
});
