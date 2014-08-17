var Ember = require('ember');
var rsvp = Ember.RSVP;
var FirebaseSimpleLogin = require('firebase-simple-login');


module.exports = Ember.Object.extend({
  firebase: void 0,
  client: void 0,
  user: void 0,
  _activePromise: null,

  init: function() {
    if (!this.get('firebase')) {
      throw new Error('Please set the `firebase` property on the adapter.');
    }
  },

  connect: function() {
    if (this.get('client')) return rsvp.resolve(this.get('user'));

    return this._promisify(function() {
      this.set('client', this._initSession());
    });
  },

  login: function(provider, options) {
    return this._promisify(function() {
      this.get('client').login(provider, options);
    });
  },

  logout: function() {
    return this._promisify(function() {
      this.get('client').logout();
    });
  },

  createUser: function(email, password) {
    return new rsvp.Promise(function(resolve, reject) {
      this.get('client').createUser(email, password, function(error, user) {
        if (error) {
          reject(error);
        } else {
          resolve(user);
        }
      });
    }.bind(this));
  },

  changePassword: function(email, oldPassword, newPassword) {
    return new rsvp.Promise(function(resolve, reject) {
      this.get('client').changePassword(email, oldPassword, newPassword, function(error) {
        if (error) {
          reject(error);
        } else {
          resolve(newPassword);
        }
      });
    }.bind(this));
  },

  sendPasswordResetEmail: function(email) {
    return new rsvp.Promise(function(resolve, reject) {
      this.get('client').sendPasswordResetEmail(email, function(error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }.bind(this));
  },

  removeUser: function(email, password) {
    return new rsvp.Promise(function(resolve, reject) {
      this.get('client').removeUser(email, password, function(error) {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    }.bind(this));
  },

  _initSession: function() {
    var session = new FirebaseSimpleLogin(this.get('firebase'), function(error, user) {
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

      this._finishPromise(error, user);
    }.bind(this));

    return session;
  },

  _promisify: function(action) {
    return new rsvp.Promise(function(resolve, reject) {
      // As we should just get an update on user's state,
      // store current promise to resolve it by state change
      // todo: maybe we should reject by some timeout?
      this._activePromise = {
        resolve: resolve,
        reject: reject
      };

      action.call(this);
    }.bind(this));
  },

  _finishPromise: function(error, user) {
    if (!this._activePromise) return;

    if (error) {
      this._activePromise.reject(error);
    } else {
      this._activePromise.resolve(user);
    }
    this._activePromise = null;
  },

  onLogin: function(user) {
    this.set('user', user);
    console.info('firebase-login: onLogin', user);
  },
  onError: function(error) {
    this.set('user', void 0);
    console.warn('firebase-login: onError', error);
  },
  onLogout: function() {
    this.set('user', void 0);
    console.info('firebase-login: onLogout');
  }

});
