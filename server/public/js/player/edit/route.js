var Ember = require('ember');

module.exports = Ember.Route.extend({
  renderTemplate: function(controller, model) {
    this.render('player/edit', {
        into: 'application',
        controller: 'playerEdit'
    });
  },

  beforeModel: function(transition) {
    if (!this.get('auth').get('isAuthenticated')) {
      return this.redirectToLogin(transition);
    }
  },

  model: function() {
    return this.get('auth').get('currentUser');
  },

  redirectToLogin: function(transition) {
    this.get('auth').set('attemptedTransition', transition);
    return this.transitionTo('login');
  }
});
