var Ember = require('ember');

module.exports = Ember.Route.extend({
  redirect: function(transition) {
    return this.get('auth').logout()
      .then(function() {
        this.transitionTo('');
      }.bind(this));
  }
});
