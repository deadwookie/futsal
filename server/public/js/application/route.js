var Ember = require('ember');

module.exports = Ember.Route.extend({
  beforeModel: function() {
    return this.get('session').fetch();
  }
});
