var Ember = require('ember');

module.exports = Ember.Route.extend({
  isAuthRequired: true,

  renderTemplate: function(controller, model) {
    this.render('player/edit', {
      into: 'application',
      controller: 'playerEdit'
    });
  },


  model: function(params, transition) {
    return this.store.find('player', transition.params.player.id);
  }

});
