var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  needs: 'player',

  oldPassword: null,
  newPassword: null,

  reset: function() {
    this.setProperties({
      oldPassword: null,
      newPassword: null
    });
  },

  actions: {
    changePassword: function() {
      var email = this.get('auth.user.email'),
        oldPassword = this.get('oldPassword'),
        newPassword = this.get('newPassword');

      this.get('auth').changePassword(email, oldPassword, newPassword)
        .then(function(value) {
          this.reset();
          this.transitionToRoute('me');
        }.bind(this), function(reason) {
          console.log(reason);
        });
    }
  }
});
