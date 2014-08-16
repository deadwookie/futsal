var Ember = require('ember');

module.exports = Ember.Route.extend({
  isAuthRequired: true,

  renderTemplate: function(controller, model) {
    this.render('player/changePassword', {
      into: 'application',
      controller: 'playerChangePassword'
    });
  },

  model: function(params, transition) {
    return this.store.find('player', transition.params.player.id);
  }

});
