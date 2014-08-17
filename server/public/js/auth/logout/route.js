var Ember = require('ember');

module.exports = Ember.Route.extend({
  redirect: function(transition) {
    return this.get('session').logout()
      .then(function() {
        this.transitionTo('');
      }.bind(this));
  }
});
