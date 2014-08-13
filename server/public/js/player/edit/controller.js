var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  needs: 'player',
  actions: {
    changePassword: function() {
      var email = this.get('auth').get('currentUser.email'),
        oldPassword = this.controller.get('oldPassword'),
        newPassword = this.controller.get('newPassword');

      this.get('auth').changePassword(email, oldPassword, newPassword)
        .then(function(value) {
          console.log(value);
          // this.reset();
          // this.transitionToRoute('me');
        }.bind(this), function(reason) {
          console.log(reason);
        });
    },

    updateProfile: function() {
      console.log('update profile');
    },
  }
});
