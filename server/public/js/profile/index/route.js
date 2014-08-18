var Ember = require('ember');

module.exports = Ember.Route.extend({
  redirect: function(params) {
    this.transitionTo('profile.setup', params);
  }
});
