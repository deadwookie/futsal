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

      this.get('auth').restore(email)
        .then(function(value) {
          console.log(value);
          this.reset();
          this.transitionToRoute('login');
        }.bind(this), function(reason) {
          console.log(reason);
        });
    }
  }
});
