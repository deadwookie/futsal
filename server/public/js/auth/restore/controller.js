var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  email: null,

  reset: function() {
    this.setProperties({
      email: null,
    });
  },

  actions: {
    restore: function() {
      var email = this.get('email');

      this.get('session.adapter').sendPasswordResetEmail(email)
        .then(function(value) {
          console.log(value);
          this.reset();
          this.transitionToRoute('auth.login');
        }.bind(this), function(reason) {
          console.error(reason);
        });
    }
  }
});
