var Ember = require('ember');

module.exports = Ember.Route.extend({
  model: function(params) {
    return this.store.find('route', params.id);
  }
});
