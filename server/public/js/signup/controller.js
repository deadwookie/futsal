var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  email: null,
  name: null,
  password: null,

  reset: function() {
    this.setProperties({
      email: null,
      name: null,
      password: null
    });
  },

  actions: {
    signup: function() {
      return this.get('auth').signup({
        email: this.get('email'),
        name: this.get('name'),
        password: this.get('password')
      });
    }
  }
});
