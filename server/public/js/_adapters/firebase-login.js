var Ember = require('ember');
var rsvp = Ember.RSVP;
var FirebaseSimpleLogin = require('firebase-simple-login');


module.exports = Ember.Object.extend({
  firebase: void 0,
  client: void 0,

  init: function() {
    if (!this.firebase || typeof this.firebase !== 'object') {
      throw new Error('Please set the `firebase` property on the adapter.');
    }
  },

  connect: function() {
    if (!this.client) {
      this.client = new FirebaseSimpleLogin(this.firebase, function(error, user) {
        if (error) {
          // An error occurred while authenticating the user
          this.onError(error);
        } else if (user) {
          // The user is successfully logged in
          this.onLogin(user);
        } else {
          // No existing session found - the user is logged out
          this.onLogout();
        }
      }.bind(this));
    }

    return rsvp.resolve(this.client);
  },

  onLogin: function(user) {
    console.info('firebase-login: onLogin', user);
  },
  onError: function(error) {
    console.warn('firebase-login: onError', error);
  },
  onLogout: function() {
    console.info('firebase-login: onLogout');
  }

});
