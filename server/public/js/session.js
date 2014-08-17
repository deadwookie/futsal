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

  login: function(email, password) {
    var options = {
      email: email,
      password: password
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
    return this.get('adapter').logout()
      .then(function() {
        this.set('user', void 0);
        console.warn('LOGOUT!!!!!!!!!!!!', this.get('user'));
      }.bind(this));
  }

});
