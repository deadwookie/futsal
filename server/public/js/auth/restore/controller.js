var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  needs: 'auth',
  auth: Ember.computed.alias('controllers.auth'),

  email: null,
  isProcessing: false,
  errorMsg: false,

  reset: function() {
    this.setProperties({
      email: null,
	  isProcessing: false,
	  errorMsg: false
    });
  },

  actions: {
    restore: function() {
      var email = this.get('email');

      this.set('isProcessing', true);
      this.get('auth').resetPassword(email)
        .then(function() {
          this.reset();
          // todo: notify that something has been send
          this.transitionToRoute('auth');
        }.bind(this))
        .catch(function(error) {
          // todo: custom error message based on error.code
          this.set('errorMsg', error.message);
          this.set('isProcessing', false);
        }.bind(this));
    }
  }
});
