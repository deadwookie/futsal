var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  email: null,
  password: null,
  name: null,
  isProcessing: false,
  errorMsg: false,

  reset: function() {
    this.setProperties({
      email: null,
      password: null,
      name: null,
      isProcessing: false,
      errorMsg: false
    });
  },

  actions: {
    signup: function() {
      var auth = this.get('auth'),
        email = this.get('email'),
        password = this.get('password'),
        profile = {
          name: this.get('name')
        };

      this.set('isProcessing', true);
      auth.createUser(email, password, profile)
        .then(function(user) {
          return auth.login(email, password);
        })
        .then(function(user) {
          this.reset();
          auth.goBack();
        }.bind(this))
        .catch(function(error) {
          // todo: custom error message based on error.code
          this.set('errorMsg', error.message);
          this.set('isProcessing', false);
        }.bind(this));
    }
  }
});
