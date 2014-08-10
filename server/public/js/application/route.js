var Ember = require('ember');

module.exports = Ember.Route.extend({
  model: function() {
    return this.store.find('player', this.get('currentUserId'));
  }
});
