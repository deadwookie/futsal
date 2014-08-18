var Ember = require('ember');

module.exports = Ember.Route.extend({
  model: function(params) {
    return this.store.find('tourney', params.id);
  },

  setupController: function(controller, model) {
    // this._super(this, arguments);

    controller.set('model', model);

    this.controllerFor('players.index').set('model', model.get('players'));
    this.controllerFor('teams').set('model', model.get('teams'));
    this.controllerFor('matches').set('model', model.get('matches'));
  },

  renderTemplate: function(controller, model) {
    this._super(this, arguments);

    // this.render();

    this.render('tourneyPlayers', {
      into: 'tourney',
      outlet: 'playersOutlet',
      controller: this.controllerFor('players.index')
    });

    this.render('tourneyTeams', {
      into: 'tourney',
      outlet: 'teamsOutlet',
      controller: this.controllerFor('teams')
    });

    this.render('tourneyTable', {
      into: 'tourney',
      outlet: 'tableOutlet',
      controller: controller
    });

    this.render('tourneyMatches', {
      into: 'tourney',
      outlet: 'matchesOutlet',
      controller: this.controllerFor('matches')
    });
  }
});
