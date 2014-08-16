var Ember = require('ember');
var Firebase = require('firebase-client');
var FirebaseSimpleLogin = require('firebase-simple-login');

// @TODO: remember me. tick. attemptedTransition
// http://firebase.github.io/firebase-simple-login/
module.exports = Ember.ObjectController.extend({

  needs: ['player'],

  /**
   * @property user
   * @type {Player}
   * @default null
   */
  user: null,

  /**
   * @todo: support redirect after login
   * @property attemptedTransition
   * @type {Transition}
   * @default null
   */
  attemptedTransition: null,

  init: function() {
    // @todo: tick. monitor a user's authentication status to keep session
    // var authRef = new Firebase(dbRoot + '/.info/authenticated');
    // authRef.on("value", function(snap) {
    //   if (snap.val() === true) {
    //     console.log("status monitor: authenticated");
    //   } else {
    //     console.log("status monitor: not authenticated");
    //   }
    // }, this);
  },

  /**
   * @todo: support "rememberMe"
   * Logs a user in with an email in password.
   * If no arguments are given attempts to login a currently active session.
   * If user does not exist or no user is logged in promise will resolve with null.
   * https://gist.github.com/raytiley/8976037
   *
   * @method login
   * @param {String} email The users email
   * @param {String} password The users password
   * @return {Promise} Returns a promise that resolves with the logged in User
   */
  login: function(email, password) {
    if (email === undefined) {
      return this._loginActiveSession();
    } else {
      return this._loginWithCredentials(email, password);
    }
  },

  /**
   * @method logout
   * @return {Promise} Returns a promise that resolves when the user is logged out.
   */
  logout: function() {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(self.get('firebase'), function(error, user) {
        Ember.run(function() {
          if (error) {
            reject(error);
          }

          authClient.logout();

          if (!user) {
            self.set('user', null);
            resolve(null);
          }
        });
      });
    });
  },

  /**
   * Performs restore password by firebase-simple-login
   * @method restore
   * @return {Promise} Returns a promise that resolves on restore.
   */
  restore: function(email) {
    var self = this;
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(self.get('firebase'), function(error, user) {
        Ember.run(function() {
          if (error) {
            reject(error);
          }
        });
      });

      authClient.sendPasswordResetEmail(email, function(error) {
        if (error === null) {
          console.log('Password reset email sent successfully');
          resolve(null);
        } else {
          console.log('Error sending password reset email:', error);
          reject(error);
        }
      });
    });

    return promise;
  },

  /**
   * Performs reset password from firebase-simple-login
   *
   * @param  {String} email       User's email
   * @param  {String} oldPassword old/current password
   * @param  {String} newPassword new password to set
   * @return {Promise}
   */
  changePassword: function(email, oldPassword, newPassword) {
    var self = this;
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(self.get('firebase'), function(error, user) {
        Ember.run(function() {
          if (error) {
            reject(error);
          }
        });
      });

      authClient.changePassword(email, oldPassword, newPassword, function(error) {
        if (error === null) {
          console.log('Password changed successfully');
          resolve(null);
        } else {
          console.log('Error changing password:', error);
          reject(error);
        }
      });
    });

    return promise;
  },

  /**
   * Create new user in firebase (type "password")
   *
   * @method createNewUser
   * @param {String} email
   * @param {String} password
   * @param {Object} optional data
   * @return {Promise} Returns a promsie that resolves with newly created user
   */
  createNewUser: function(email, password, options) {
    options || (options = {});

    var self = this;
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
        var authClient = new FirebaseSimpleLogin(self.get('firebase'), function(error, user) {
          Ember.run(function() {
            if (error) {
              reject(error);
            }

            authClient.createUser(email, password, function(error, user) {
              if (error) {
                reject(error);
              }
              if (user) {
                var newUser = self.store.createRecord('player', {
                  id: user.id,
                  email: user.email,
                  name: options.name
                });

                var appUser = newUser.save().then(function(value) {
                  self.set('user', value);
                  return value;
                });

                authClient.login('password', {email: email, password: password});
                resolve(appUser);
              }
            });
          });
        });
    });

    return promise;
  },

  /**
   * @todo: support "rememberMe"
   * Login user with credentials (email/password)
   *
   * @param  {String} email    User's email
   * @param  {String} password User's password
   * @return {Promise}
   */
  _loginWithCredentials: function(email, password) {
    var self = this;

    // Setup a promise that creates the FirebaseSimpleLogin and resolves
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(self.get('firebase'), function(error, user) {
        // First Time this fires error and user should be null. If connection successful
        // Second Time will be due to login. In that case we should have user or error
        Ember.run(function() {
          // Handle posible errors.
          if (error && error.code === 'INVALID_USER') {
            resolve(null);
          } else if (error) {
            reject(error);
          }

          // Setup user and return with resolve
          if (user) {
            var appUser = self.store.find('player', user.id).then(function(appUser) {
              self.set('user', appUser);
              return appUser;
            });

            resolve(appUser);
          }
        });
      });

      authClient.login('password', {
        email: email,
        password: password
      });
    });

    return promise;
  },

  /**
   * @todo: merge with _loginWithCredentials
   * Login user active session
   *
   * @return {Promise}
   */
  _loginActiveSession: function() {
    var self = this;

    // Setup a promise that creates the FirebaseSimpleLogin and resolves
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(self.get('firebase'), function(error, user) {
        // This callback should fire just once if no error or user than not logged in
        Ember.run(function() {
          if (!error && !user) {
            resolve(null);
          }
          if (error) {
            reject(error);
          }
          if (user) {
            var appUser = self.store.find('player', user.id).then(function(value) {
              self.set('user', value);
              return value;
            });

            resolve(appUser);
          }
        });
      });
    });

    return promise;
  }
});
