var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  email: null,
  password: null,
  rememberMe: false,
  isProcessing: false,
  errorMsg: false,

  reset: function() {
    this.setProperties({
      email: null,
      password: null,
      rememberMe: false,
      errorMsg: false,
      isProcessing: false
    });
  },

  actions: {
    login: function() {
      var auth = this.get('auth'),
        email = this.get('email'),
        password = this.get('password'),
        rememberMe = this.get('rememberMe');

      this.set('isProcessing', true);
      auth.login(email, password, rememberMe)
        .then(function(user) {
          this.reset();
          auth.goBack() || this.transitionToRoute('');
        }.bind(this))
        .catch(function(error) {
          console.warn('login error', error, error.stack);
          // todo: custom error message based on error.code
          this.set('errorMsg', error.message);
          this.set('isProcessing', false);
        }.bind(this));
    }
  }
});
