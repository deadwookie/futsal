var Ember = require('ember');

module.exports = Ember.Object.extend({
  adapter: void 0,
  user: void 0,
  _userModelName: 'player',

  init: function() {
    if (!this.get('adapter')) {
      throw new Error('Please set the `adapter` property on the session.');
    }
  },

  fetch: function() {
    return this.get('adapter').connect()
      .then(function(user) {
        if (user) {
          // it seems, user is logged in, let's find the actual data model
          return this.store.find(this._userModelName, user.id);
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
        return this.store.find(this._userModelName, user.id);
      }.bind(this))
      .then(function(user) {
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
  }

});
