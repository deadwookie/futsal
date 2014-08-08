var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  email: null,
  password: null,
  name: null,

  reset: function() {
    this.setProperties({
      email: null,
      password: null,
      name: null
    });
  },

  actions: {
    signup: function() {
      var email = this.get('email'),
        password = this.get('password'),
        userdata = {
          name: this.get('name')
        };

      this.get('auth').createNewUser(email, password, userdata)
        .then(function(value) {
          this.reset();
          this.transitionToRoute('me');
        }.bind(this), function(reason) {
          console.error(reason);
        });
    }
  }
});
