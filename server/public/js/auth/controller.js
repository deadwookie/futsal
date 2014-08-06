var Ember = require('ember');
var Firebase = require("firebase-client");
var FirebaseSimpleLogin = require("firebase-simple-login");

var dbRoot = "https://popping-fire-6658.firebaseio.com";
var dbRef = new Firebase(dbRoot);
var usersPath = dbRoot + "/players";

// @TODO: rethink ...
module.exports = Ember.ObjectController.extend({
  isAuthenticated: false,
  currentUser: null,
  attemptedTransition: null,

  init: function() {
      // monitor a user's authentication status
      var authRef = new Firebase(dbRoot + '/.info/authenticated');
      authRef.on("value", function(snap) {
        if (snap.val() === true) {
          console.log("status monitor: authenticated");
        } else {
          console.log("status monitor: not authenticated");
        }
      }, this);

    this.authClient = new FirebaseSimpleLogin(dbRef, this.authCompleted.bind(this));
  },

  authCompleted: function(error, user) {
    if (error) {
      // an error occurred while attempting login
      console.error('Authentication failed: ' + error);
      this.set('isAuthenticated', false);
      this.set('currentUser', null);
    } else if (user) {
      // user authenticated with Firebase
      console.log("User UID: " + user.uid + ", ID: " + user.id + ", Provider: " + user.provider);
      this.set('isAuthenticated', true);
      this.set('currentUser', user.uid);

      // console.log('@TODO: goto transitionToRoute(attemptedTransition || me)');
      // this.transitionToRoute(this.attemptedTransition || 'me');
    } else {
      // user is logged out
      console.log('Logged out');
      this.set('isAuthenticated', false);
      this.set('currentUser', null);
    }
  },

  login: function(form) {
    this.authClient.login('password', {
      email: form.email,
      password: form.password,
      rememberMe: form.rememberMe
    });
  },

  signup: function(form) {
    this.authClient.createUser(form.email, form.password, function(error, user) {
      if (error) {
        console.error('Signup failed: ' + error);
      } else {
        console.log("User UID: " + user.uid + ", ID: " + user.id + ', Email: ' + user.email);

        var userRef = new Firebase(usersPath);
        userRef.child(user.uid).set({
          name: form.name,
          email: form.email,
          rating: 0
        });

        console.log('SUCCESS! @TODO: goto transitionToRoute(login) or do login');
        // this.transitionToRoute('login');
      }
    });
  },

  logout: function() {
    this.authClient.logout();
    console.log('SUCCESS! @TODO: goto transitionToRoute(login)');
    // this.transitionToRoute('login');
  }
});
