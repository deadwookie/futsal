var Ember = require('ember');

module.exports = Ember.Route.extend({
  isAuthRequired: true,
  isPermissionRequired: ['@current', 'user-edit'],

  model: function(params) {
    return this.store.find('player', params.id);
  }
});
