var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  email: null,
  password: null,
  rememerMe: false,

  reset: function() {
    this.setProperties({
      email: null,
      password: null,
      rememerMe: false
    });
  },

  actions: {
    login: function() {
      var email = this.get('email'),
        password = this.get('password');

      this.get('session').login(email, password)
        .then(function(user) {
          this.reset();
          this.transitionToRoute('');
        }.bind(this), function(reason) {
          console.error(reason);
        });
    }
  }
});
