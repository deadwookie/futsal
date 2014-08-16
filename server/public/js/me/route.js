var Ember = require('ember');
var PlayerRoute = require('../player/route');

// An alias to existed player
module.exports = PlayerRoute.extend({
  templateName: 'player',
  // viewName: 'player',
  controllerName: 'player',

  model: function() {
    var user = this.get('auth.user');
    return this._super({id: user.id});
  },

  beforeModel: function(transition) {
    if (!this.get('auth.user')) {
      return this.redirectToLogin(transition);
    }
  },

  redirectToLogin: function(transition) {
    this.get('auth').set('attemptedTransition', transition);
    return this.transitionTo('login');
  }
});
