var Ember = require('ember');
var DS = require('ember-data');

var user = {
  id: 1
};

var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});
App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function() {
  this.route('me', {path: '/'});
  this.resource('players');
  this.resource('player', {path: 'players/:id'});
  this.resource('tourneys');
});

App.PlayersRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('player');
  }
});
App.PlayerRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('player', params.id);
  }
});

App.Player = require('./player/model');
App.Player.FIXTURES = require('./player/fixtures.json');


// An alias to existed player
App.MeRoute = App.PlayerRoute.extend({
  templateName: 'player',
  // viewName: 'player',
  // controllerName: 'player',
  model: function() {
    return this._super({id: user.id});
  }
});

