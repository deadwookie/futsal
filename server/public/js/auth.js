var Ember = require('ember');

module.exports = Ember.Object.extend({
  adapter: void 0,
  user: void 0,
  _userModelName: 'player',
  _userModelIdPrefix: 'player_',
  _userModelId: function() {
    return this.get('_userModelIdPrefix') + this.get('adapter.user.id');
  }.property('_userModelIdPrefix', 'adapter.user.id'),
  /**
   * Redirect after login
   * @property attemptedTransition
   * @type {Transition}
   * @default null
   */
  attemptedTransition: null,

  init: function() {
    if (!this.get('adapter')) {
      throw new Error('Please set the `adapter` property for `auth` controller.');
    }
  },

  goBack: function() {
    var transition = this.get('attemptedTransition');
    if (!transition) {
      return false;
    }

    this.set('attemptedTransition', null);
    return transition.retry();
  },

  session: function() {
    return this.get('adapter').connect()
      .then(function(user) {
        if (user) {
          // it seems, user is logged in, let's find the actual data model
          return this.store.find(this.get('_userModelName'), this.get('_userModelId'));
        }

        return void 0;
      }.bind(this))
      .then(function(user) {
        console.info('session user:', user && user.toJSON());
        this.set('user', user);
        return user;
      }.bind(this));
  },

  login: function(email, password, rememberMe) {
    var options = {
      email: email,
      password: password,
      rememberMe: !!rememberMe
    };

    return this.get('adapter').login('password', options)
      .then(function(user) {
        if (!user) throw new Error('User is undefined');
        return this.store.find(this.get('_userModelName'), this.get('_userModelId'));
      }.bind(this))
      .then(function(user) {
        console.info('logged user:', user && user.toJSON());
        this.set('user', user);
        return user;
      }.bind(this));
  },

  logout: function() {
    this.set('user', void 0);
    return this.get('adapter').logout();
  },

  hasPermission: function(check, options) {
    var user = this.get('user'),
      result = [],
      permissions, path;
    options || (options = {});

    if (!check) return true;
    if (!user) return false;

    check = [].concat(check);
    permissions = user.get('permissions') || Ember.Object.create();
    if (!permissions) return false;

    if (permissions.get('all')) return true;
    check.forEach(function(p) {
      if (permissions.get(p)) {
        result.push(p);
        return;
      }

      if (options.model && p === '@current') {
        // hook for user's own data
        // todo: rethink
        if (options.model.get('id') === user.get('id')) result.push(p);
      }
    });

    // should user has all passed permissions or at least one?
    return options.atLeastOne ? result.length > 0 : check.length === result.length;
  },

  createUser: function(email, password, profile) {
    return this.get('adapter').createUser(email, password)
      .then(function(user) {
        return this._createRecord(user, profile);
      }.bind(this));
  },

  resetPassword: function(email) {
    return this.get('adapter').sendPasswordResetEmail(email);
  },

  changePassword: function(email, oldPassword, newPassword) {
    return this.get('adapter').changePassword(email, oldPassword, newPassword);
  },

  _createRecord: function(user, profile) {
    var record = this.store.createRecord(this.get('_userModelName'), {
      id: this._generateUserId(user, profile),
      email: user.email
    });

    record.setProperties(profile);

    if (!record.get('name')) {
      record.set('name', String(user.email).split('@').shift());
    }

    return record.save();
  },

  _generateUserId: function(user, profile) {
    return this.get('_userModelIdPrefix') + user.id;
  }

});
