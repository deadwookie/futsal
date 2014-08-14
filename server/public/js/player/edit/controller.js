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
          this.transitionToRoute('me');
        }.bind(this), function(reason) {
          console.log(reason);
        });
    },

    updateProfile: function() {
      var model = this.get('model');
      model.set('name', this.get('name'));
      model.set('photo', this.get('photoCropped') || this.get('photo'));
      model.set('isApproved', this.get('isApproved'));
      model.save();
      // this.transitionToRoute('player', this.get('model'));
      this.transitionToRoute('me');
    },
  }
});
