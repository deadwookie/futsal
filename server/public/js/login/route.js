var Ember = require('ember');

module.exports = Ember.Route.extend({

  beforeModel: function(transition) {
    if (!this.get('auth').get('isAuthenticated')) {
      // lets try to _loginActiveSession
      this.get('auth').login().then(function(value) {
       value && this.transitionTo('me');
      }.bind(this));
    } else {
      // or just redirect to profile
      return this.transitionTo('me');
    }
  }
});
