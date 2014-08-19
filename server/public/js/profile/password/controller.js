var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  oldPassword: null,
  newPassword: null,
  isProcessing: false,
  errorMsg: false,

  reset: function() {
    this.setProperties({
      oldPassword: null,
      newPassword: null,
      isProcessing: false,
      errorMsg: false
    });
  },

  actions: {
    changePassword: function() {
      var email = this.get('model.email'),
        oldPassword = this.get('oldPassword'),
        newPassword = this.get('newPassword');

      this.set('isProcessing', true);
      this.get('auth').changePassword(email, oldPassword, newPassword)
        .then(function() {
          this.reset();
          // todo: notify "password updated"
          this.transitionToRoute('players.player', this.get('model'));
        }.bind(this))
        .catch(function(error) {
          // todo: custom error message based on error.code
          this.set('errorMsg', error.message);
          this.set('isProcessing', false);
        }.bind(this));
    }
  }
});
