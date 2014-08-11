var Ember = require('ember');
var DS = require('ember-data');
var EmberFire = require('emberfire');
var Firebase = require("firebase-client");
var config = require('../../config/server.json');

var App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  ready: function() {
    this.register('main:auth', App.AuthController);
    this.inject('route', 'auth', 'main:auth');
    this.inject('controller', 'auth', 'main:auth');
  }
});

App.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: new Firebase('https://' + config.firebase.host)
});
App.templates = Ember.TEMPLATES;

App.Router.map(function() {
  this.route('me', {path: '/'});
  this.route('login');
  this.route('signup');

  this.resource('players');
  this.resource('player', {path: 'players/:id'});
  this.resource('tourneys');
  this.resource('tourney', {path: 'tourneys/:id'});

  this.resource('gameday');
});

// Application
App.ApplicationRoute = require('./application/route');
App.ApplicationController = require('./application/controller');
App.templates.application = require('./application/template.hbs');

// Auth
App.AuthRoute = require('./auth/route');
App.AuthController = require('./auth/controller');

// login
App.LoginRoute = require('./login/route');
App.LoginController = require('./login/controller');
App.templates.login = require('./login/template');

// signup
App.SignupRoute = require('./signup/route');
App.SignupController = require('./signup/controller');
App.templates.signup = require('./signup/template');

// Gameday
App.templates.gameday = require('./gameday/template.hbs');

// Player Model
App.Player = require('./player/model');
App.PlayerAdapter = App.ApplicationAdapter.extend({
  pathForType: function(type) {
    return 'players';
  }
});

// Player
App.PlayerRoute = require('./players/route');
App.PlayerController = require('./player/controller');
App.templates.player = require('./player/template.hbs');

// Players
App.PlayersRoute = require('./players/route');
App.PlayersController = require('./players/controller');
App.templates.players = require('./players/template.hbs');

// Tourney Model
App.Tourney = require('./tourney/model');
App.TourneyAdapter = App.ApplicationAdapter.extend({
  pathForType: function(type) {
    return 'tourneys';
  }
});

// Tourney
App.TourneyRoute = require('./tourney/route');
App.TourneyController = require('./tourney/controller');
App.templates.tourney = require('./tourney/template.hbs');
App.templates.tourneyPlayers = require('./tourney/players.hbs');
App.templates.tourneyTeams = require('./tourney/teams.hbs');
App.templates.tourneyTable = require('./tourney/table.hbs');
App.templates.tourneyMatches = require('./tourney/matches.hbs');

// Tourneys
App.TourneysRoute = require('./tourneys/route');
App.templates.tourneys = require('./tourneys/template.hbs');

// Team Model
App.Team = require('./team/model');
App.TeamAdapter = App.ApplicationAdapter.extend({
  pathForType: function(type) {
    return 'teams';
  }
});

// Team
App.TeamRoute = require('./team/route');
App.TeamController = require('./team/controller');

// Teams
App.TeamsRoute = require('./teams/route');
App.TeamsController = require('./teams/controller');
App.templates.teams = require('./teams/template.hbs');

// Match Model
App.Match = require('./match/model');
App.MatchAdapter = App.ApplicationAdapter.extend({
  pathForType: function(type) {
    return 'matches';
  }
});

// Match
App.MatchRoute = require('./match/route');
App.MatchController = require('./match/controller');

// Matches
App.MatchesRoute = require('./matches/route');
App.MatchesController = require('./matches/controller');
App.templates.matches = require('./matches/template.hbs');

// Me
App.MeRoute = require('./me/route');

// debug purpose
global.zApp = module.exports = App;
