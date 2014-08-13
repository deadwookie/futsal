var PlayerRoute = require('../../player/route');

module.exports = PlayerRoute.extend({
  templateName: 'me/settings',

  model: function() {
    var currentUser = this.get('auth').get('currentUser');
    return currentUser ? this._super({id: currentUser.id}) : Ember.Object.create();
  },

  // @TODO: move to controller
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
    }
  }
});
