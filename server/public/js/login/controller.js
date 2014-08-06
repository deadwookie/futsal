var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  // needs: ['auth'],
  // isAuthenticated: Em.computed.alias("controllers.auth.isAuthenticated"),

  email: null,
  password: null,

  loginFailed: false,
  isProcessing: false,

  actions: {
    login: function() {
      return this.get('auth').login({
        email: this.get('email'),
        password: this.get('password')
      });
    }
  }
});
