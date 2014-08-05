var Ember = require('ember');
var DS = require('ember-data');

var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});
App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(require('./app/routermap'));
Ember.TEMPLATES.application = require('./app/template.hbs');

App.PlayersRoute = require('./players/route');
App.PlayersController = require('./players/controller');
Ember.TEMPLATES.players = require('./players/template.hbs');

App.Player = require('./player/model');
App.Player.FIXTURES = require('./player/fixtures.json');

App.PlayerRoute = require('./players/route');
Ember.TEMPLATES.player = require('./player/template.hbs');

App.Tourney = require('./tourney/model');
App.Tourney.FIXTURES = require('./tourney/fixtures.json');
App.TourneyRoute = require('./tourney/route');
App.TourneyController = require('./tourney/controller');
Ember.TEMPLATES.tourney = require('./tourney/template.hbs');
Ember.TEMPLATES.tourneyPlayers = require('./tourney/players.hbs');
Ember.TEMPLATES.tourneyTeams = require('./tourney/teams.hbs');
Ember.TEMPLATES.tourneyTable = require('./tourney/table.hbs');
Ember.TEMPLATES.tourneyMatches = require('./tourney/matches.hbs');

App.TourneysRoute = require('./tourneys/route');
Ember.TEMPLATES.tourneys = require('./tourneys/template.hbs');

App.Team = require('./team/model');
App.Team.FIXTURES = require('./team/fixtures.json');
App.TeamRoute = require('./team/route');
App.TeamController = require('./team/controller');

App.TeamsRoute = require('./teams/route');
App.TeamsController = require('./teams/controller');
Ember.TEMPLATES.teams = require('./teams/template.hbs');

App.Match = require('./match/model');
App.Match.FIXTURES = require('./match/fixtures.json');
App.MatchRoute = require('./match/route');
App.MatchController = require('./match/controller');

App.MatchesRoute = require('./matches/route');
App.MatchesController = require('./matches/controller');
Ember.TEMPLATES.matches = require('./matches/template.hbs');

App.MeRoute = require('./me/route');

