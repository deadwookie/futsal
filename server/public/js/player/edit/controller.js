var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  needs: 'player',
  photoCropped: null,

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
      console.log('@TODO: update (save) profile');
      console.log('name: ' + this.get('name'));
      console.log('photo: ' + this.get('photo'));
      console.log('photoCropped: ' + this.get('photoCropped'));
      console.log('isApproved: ' + this.get('isApproved'));
    },
  }
});
