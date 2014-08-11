var Ember = require('ember');

module.exports = Ember.ObjectController.extend({

  isAuthenticated: function() {
    return this.get('auth').get('isAuthenticated');
  }.property('auth.isAuthenticated'),

  actions: {
    logout: function() {
      this.get('auth').logout()
        .then(function(error) {
          // @FIXME: can't transition to login page due to auto login with active session there...
          !error && this.transitionToRoute('login');
        }.bind(this));
    }
  }
});
