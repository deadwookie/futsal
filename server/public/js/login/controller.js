var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  email: null,
  password: null,

  reset: function() {
    this.setProperties({
      email: null,
      password: null
    });
  },

  actions: {
    login: function() {
      var email = this.get('email'),
        password = this.get('password');

      this.get('auth').login(email, password)
        .then(function(value) {
          if (!value) {
            console.error('INVALID_USER');
          }
          this.reset();
          this.transitionToRoute('me');
        }.bind(this), function(reason) {
          console.log(reason);
        });
    }
  }
});
