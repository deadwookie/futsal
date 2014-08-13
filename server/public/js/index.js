var Ember = require('ember');
var DS = require('ember-data');
var EmberFire = require('emberfire');
var Firebase = require("firebase-client");
var config = require('config')
  // Note: Cannot use config.file() or config.dir(),
  // Because browserify doesn't allow to require files by variable name :(
  .extend(require('../../config/browser.overrides.json'))
  .extend(require('../../config/services.json'))
  .extend(require('../../config/browser.json'));


var App = Ember.Application.create({
  LOG_TRANSITIONS: true,
  ready: function() {
    this.register('main:auth', App.AuthController);
    this.inject('route', 'auth', 'main:auth');
    this.inject('controller', 'auth', 'main:auth');
  }
});

App.ApplicationAdapter = DS.FirebaseAdapter.extend({
  firebase: new Firebase(config.get('firebase.host'))
});
App.templates = Ember.TEMPLATES;
App.config = config;

App.Router.map(function() {
  // this.route('me', {path: '/'});
  this.resource('me', {path: '/'}, function() {
    this.route('settings');
  });

  this.route('login');
  this.route('signup');
  this.route('restore');

  this.resource('players');
  this.resource('player', {path: 'players/:id'});
  this.resource('tourneys', function() {
    this.route('new');
  });
  this.resource('tourney', {path: 'tourneys/:id'});

  this.resource('gameday', function() {
    this.route('players');
    this.route('teams');
    this.route('matches');
  });

  this.resource('voting', function() {
    this.route('player', {path: ':id'});
  });
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

// restore (password)
App.RestoreRoute = require('./restore/route');
App.RestoreController = require('./restore/controller');
App.templates.restore = require('./restore/template');

// Gameday
App.GamedayIndexRoute = require('./gameday/index/route');
App.templates.gameday = require('./gameday/template.hbs');
App.templates['gameday/players'] = require('./gameday/players.hbs');
App.templates['gameday/teams'] = require('./gameday/teams.hbs');
App.templates['gameday/matches'] = require('./gameday/matches.hbs');

// Voting
App.VotingRoute = require('./voting/route');
App.VotingController = require('./voting/controller');
App.templates.voting = require('./voting/template.hbs');

App.VotingPlayerController = require('./voting/player/controller');
App.VotingPlayerRoute = require('./voting/player/route');
App.templates['voting/player'] = require('./voting/player/template.hbs');

// Player Model
App.Player = require('./player/model');

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

// Tourney
App.TourneyRoute = require('./tourney/route');
App.TourneyController = require('./tourney/controller');
App.templates.tourney = require('./tourney/template.hbs');
App.templates['tourneys/new'] = require('./tourney/mockup.hbs');
App.templates.tourneyPlayers = require('./tourney/players.hbs');
App.templates.tourneyTeams = require('./tourney/teams.hbs');
App.templates.tourneyTable = require('./tourney/table.hbs');
App.templates.tourneyMatches = require('./tourney/matches.hbs');

// Tourneys
App.TourneysRoute = require('./tourneys/route');
App.TourneysIndexRoute = require('./tourneys/index/route');
App.templates.tourneys = require('./tourneys/template.hbs');

// Team Model
App.Team = require('./team/model');

// Team
App.TeamRoute = require('./team/route');
App.TeamController = require('./team/controller');

// Teams
App.TeamsRoute = require('./teams/route');
App.TeamsController = require('./teams/controller');
App.templates.teams = require('./teams/template.hbs');

// Match Model
App.Match = require('./match/model');

// Match
App.MatchRoute = require('./match/route');
App.MatchController = require('./match/controller');

// Matches
App.MatchesRoute = require('./matches/route');
App.MatchesController = require('./matches/controller');
App.templates.matches = require('./matches/template.hbs');

// Me
App.MeRoute = require('./me/route');

// Me Settings
App.MeSettingsRoute = require('./me/settings/route');
App.templates['me/settings'] = require('./me/settings/template.hbs');

// debug purpose
global.zApp = module.exports = App;
