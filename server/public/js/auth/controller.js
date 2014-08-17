var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  /**
   * Redirect after login
   * @property attemptedTransition
   * @type {Transition}
   * @default null
   */
  attemptedTransition: null,

  goBack: function() {
    var transition = this.get('attemptedTransition');
    if (transition) {
      this.set('attemptedTransition', null);
      transition.retry();
    } else {
      this.transitionToRoute('');
    }
  },

  login: function(email, password, rememberMe) {
    return this.get('session').login(email, password, rememberMe);
  },

  logout: function() {
    return this.get('session').logout();
  },

  createUser: function(email, password, profile) {
    return this.get('session.adapter').createUser(email, password)
      .then(function(user) {
        var newUser = this.store.createRecord(this.get('session._userModelName'), {
          id: user.id,
          email: user.email
        });

        newUser.setProperties(profile);

        if (!newUser.get('name')) {
          newUser.set('name', String(user.email).split('@').shift());
        }

        return newUser.save();
      }.bind(this));
  },

  resetPassword: function(email) {
    return this.get('session.adapter').sendPasswordResetEmail(email);
  },

  changePassword: function(email, oldPassword, newPassword) {
    return this.get('session.adapter').changePassword(email, oldPassword, newPassword);
  },

  hasPermission: function(check, options) {
    console.warn('auth:user hasPermission', this.get('user'));
    return true;

    var user = this.get('user'),
      result = [],
      permissions;
    options || (options = {});

    if (!check) return true;
    if (!user) return false;

    check = [].concat(check);
    permissions = user.get('permissions');

    if (permissions.get('all')) return true;
    check.forEach(function(p) {
      if (permissions.get(p)) result.push(p);
    });

    // should user has all passed permissions or at least one?
    return options.strict ? check.length === result.length : result.length > 0;
  },

});
