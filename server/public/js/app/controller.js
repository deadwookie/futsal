var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  isAuthenticated: function() {
    return this.get('auth').get('isAuthenticated');
  }.property('auth.isAuthenticated')
});
