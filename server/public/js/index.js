var Ember = require('ember');
var DS = require('ember-data');

var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});
App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(require('./app/routermap'));
Ember.TEMPLATES.application = require('./app/template.hbs');

App.PlayersRoute = require('./players/route');
Ember.TEMPLATES.players = require('./players/template.hbs');

App.Player = require('./player/model');
App.Player.FIXTURES = require('./player/fixtures.json');

App.PlayerRoute = require('./players/route');
Ember.TEMPLATES.player = require('./player/template.hbs');

App.MeRoute = require('./me/route');

