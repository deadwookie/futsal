var Ember = require('ember');

module.exports = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('auth.login');
  }
});
