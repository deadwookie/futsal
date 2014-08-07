var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  email: null,
  password: null,

  loginFailed: false,
  isProcessing: false,

  reset: function() {
    this.setProperties({
      email: null,
      name: null,
      password: null
    });
  },

  actions: {
    login: function() {
      return this.get('auth').login({
        email: this.get('email'),
        password: this.get('password')
      });
    }
  }
});
