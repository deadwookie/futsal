var Ember = require('ember');
var PlayerRoute = require('../player/route');

// An alias to existed player
module.exports = PlayerRoute.extend({
  templateName: 'player',
  // viewName: 'player',
  controllerName: 'player',

  model: function() {
    var user = this.get('auth.user');
    return user ? this._super({id: user.id}) : Ember.Object.create();
  },

  beforeModel: function(transition) {
    if (!this.get('auth').get('isAuthenticated')) {
      return this.redirectToLogin(transition);
    }
  },

  redirectToLogin: function(transition) {
    this.get('auth').set('attemptedTransition', transition);
    return this.transitionTo('login');
  }
});
