var Ember = require('ember');
var Firebase = require('firebase-client');
var FirebaseSimpleLogin = require('firebase-simple-login');
var config = require('config');
var dbRef = new Firebase(config.get('firebase.host'));

// @TODO: remember me. tick. attemptedTransition
// http://firebase.github.io/firebase-simple-login/
module.exports = Ember.ObjectController.extend({

  needs: ['player'],

  /**
  @property currentUser
  @type {User}
  @default null
  */
  currentUser: null,
  /**
  @property isAuthenticated
  @type {bool}
  @default null
  */
  isAuthenticated: false,
  /**
  @property attemptedTransition
  @type {transition}
  @default null
  */
  attemptedTransition: null,

  init: function() {
    // tick. monitor a user's authentication status
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
  Logs a user in with an email in password.
  If no arguments are given attempts to login a currently active session.
  If user does not exist or no user is logged in promise will resolve with null.
  https://gist.github.com/raytiley/8976037

  @method login
  @param {String} email The users email
  @param {String} password The users password
  @return {Promise} Returns a promise that resolves with the logged in User
  */
  login: function(email, password) {
    if (email === undefined) {
      return this._loginActiveSession();
    } else {
      return this._loginWithCredentials(email, password);
    }
  },

  /**
  @method logout
  @return {Promise} Returns a promise that resolves when the user is logged out.
  */
  logout: function() {
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(dbRef, function(error, user) {
        Ember.run(function() {
          if (error) {
            reject(error);
          }

          authClient.logout();

          if (!user) {
            self.set('currentUser', null);
            self.set('isAuthenticated', false);
            resolve(null);
          }
        });
      });
    });
  },

  /**
  Restore password
  @method restore
  @return {Promise} Returns a promise that resolves on restore.
  */
  restore: function(email) {
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(dbRef, function(error, user) {
        Ember.run(function() {
          if (error) {
            reject(error);
          }
        });
      });

      authClient.sendPasswordResetEmail(email, function(error) {
        if (error === null) {
          console.log("Password reset email sent successfully");
          resolve(null);
        } else {
          console.log("Error sending password reset email:", error);
          reject(error);
        }
      });
    });

    return promise;
  },

  changePassword: function(email, oldPassword, newPassword) {
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(dbRef, function(error, user) {
        Ember.run(function() {
          if (error) {
            reject(error);
          }
        });
      });

      authClient.changePassword(email, oldPassword, newPassword, function(error) {
        if (error === null) {
          console.log("Password changed successfully");
          resolve(null);
        } else {
          console.log("Error changing password:", error);
          reject(error);
        }
      });
    });

    return promise;
  },

  /**

  @method createNewUser
  @param {String} email
  @param {String} password
  @param {Object} optional data
  @return {Promise} Returns a promsie that resolves with newly created user
  */
  createNewUser: function(email, password, options) {
    options || (options = {});

    var self = this;
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
        var authClient = new FirebaseSimpleLogin(dbRef, function(error, user) {
          Ember.run(function() {
            if (error) {
              reject(error);
            }

            authClient.createUser(email, password, function(error, user) {
              if (error) {
                reject(error);
              }
              if (user) {
                var newUser = self.get('controllers.player').store.createRecord('player', {
                  id: user.id,
                  email: user.email,
                  name: options.name
                });

                var appUser = newUser.save().then(function(value) {
                  self.set('currentUser', value);
                  self.set('isAuthenticated', true);
                  return value;
                });

                authClient.login('password', {email: email, password: password});
                resolve(appUser);
              }
            });
          });
        });

        // authClient.createUser(email, password, function(error, user) {
        //   Ember.run(function() {
        //     if (error)
        //       reject(error);

        //     if (user) {
        //       authClient.login('password', {email: email, password: password});
        //     }
        //   });
        // });
    });

    return promise;
  },

  _loginWithCredentials: function(email, password) {
    var self = this;
    // Setup a promise that creates the FirebaseSimpleLogin and resolves
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(dbRef, function(error, user) {
        //First Time this fires error and user should be null. If connection successful
        //Second Time will be due to login. In that case we should have user or error
        Ember.run(function() {
          // Handle posible errors.
          if (error && error.code === 'INVALID_USER') {
            resolve(null);
          } else if (error) {
            reject(error)
          }

          // Handle user
          if (user) {
            var appUser = self.get('controllers.player').store.find('player', user.id).then(function(appUser) {
              self.set('currentUser', appUser);
              appUser && self.set('isAuthenticated', true);
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

  _loginActiveSession: function() {
    var self = this;
    // Setup a promise that creates the FirebaseSimpleLogin and resolves
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var authClient = new FirebaseSimpleLogin(dbRef, function(error, user) {
        // This callback should fire just once if no error or user than not logged in
        Ember.run(function() {
          if (!error && !user) {
            resolve(null);
          }

          if (error) {
            reject(error);
          }

          if (user) {
            var appUser = self.get('controllers.player').store.find('player', user.id).then(function(value) {
              self.set('currentUser', value);
              value && self.set('isAuthenticated', true);
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
