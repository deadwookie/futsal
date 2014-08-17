var Ember = require('ember');
var DS = require('ember-data');
var EmberFire = require('emberfire');
var Firebase = require('firebase-client');
var config = require('config')
  // Note: Cannot use config.file() or config.dir(),
  // Because browserify doesn't allow to require files by variable name :(
  .extend(require('../../config/browser.overrides.json'))
  .extend(require('../../config/services.json'))
  .extend(require('../../config/ember.json'))
  .extend(require('../../config/browser.json'));

var Application = Ember.Application.extend({
  // Basic logging, e.g. "Transitioned into 'post'"
  LOG_TRANSITIONS: config.get('ember.log.transitions'),

  // Extremely detailed logging, highlighting every internal
  // step made while transitioning into a route, including
  // `beforeModel`, `model`, and `afterModel` hooks, and
  // information about redirects and aborted transitions
  LOG_TRANSITIONS_INTERNAL: config.get('ember.log.transitionsInternal'),

  // Log generated classes
  LOG_ACTIVE_GENERATION: config.get('ember.log.activeGeneration'),

  // Useful for understanding which objects Ember is finding
  // when it does a lookup and which it is generating automatically for you.
  LOG_RESOLVER: config.get('ember.log.resolver')
});
var App;

// Log
Ember.LOG_BINDINGS = config.get('ember.log.bindings');
Ember.LOG_STACKTRACE_ON_DEPRECATION  = config.get('ember.log.deprecation');

// injections
Ember.Application.initializer({
  name: 'config',
  initialize: function(container, application) {
    // Convert whole config to what Ember likes
    var cfg = Ember.Object.extend(config.get());

    container.register('config:main', cfg);

    container.injection('route', 'config', 'config:main');
    container.injection('controller', 'config', 'config:main');
    container.injection('model', 'config', 'config:main');
  }
});

Ember.Application.initializer({
  name: 'firebase:ref',
  after: ['firebase', 'config'],
  before: 'auth',
  initialize: function(container, application) {
    var FirebaseLoginAdapter = require('./_adapters/firebase-login');
    var config = container.lookup('config:main');
    var firebaseRef = new Firebase(config.get('firebase.host'));

    container.register('firebase:ref', firebaseRef, {instantiate: false});

    container.register('adapter:application', container.lookupFactory('adapter:-firebase'));
    container.injection('adapter:application', 'firebase', 'firebase:ref');

    container.register('firebase:login', FirebaseLoginAdapter);
    container.injection('firebase:login', 'firebase', 'firebase:ref');
  }
});

Ember.Application.initializer({
  name: 'auth',
  initialize: function(container, application) {
    var Session = require('./session');

    container.register('session:main', Session);
    container.injection('session:main', 'store', 'store:main');
    container.injection('session:main', 'adapter', 'firebase:login');

    container.injection('route', 'session', 'session:main');
    container.injection('controller', 'session', 'session:main');

    Ember.Route.reopen({
      beforeModel: function(transition) {
        var permissions;

        if (this.get('isAuthRequired') && !this.get('session.user')) {
          this.controllerFor('auth').set('attemptedTransition', transition);
          console.warn('auth is required', transition.toString());
          // TODO: show a "login required" message
          return this.transitionTo('auth');
        }

        // permissions = this.get('isPermissionRequired');
        // if (permissions && !this.get('auth').hasPermission(permissions)) {
        //   // TODO: show "no permission" message
        //   transition.abort();
        // }
      }
    });
  }
});


// start App
App = Application.create();
App.templates = Ember.TEMPLATES;

App.Router.map(function() {
  this.route('me', {path: '/'});

  this.resource('auth', function() {
    this.route('login');
    this.route('logout');
    this.route('signup');
    this.route('restore');
  });

  this.resource('voting', function() {
    this.route('player', {path: ':id'});
  });

  this.resource('players');
  this.resource('player', {path: 'players/:id'}, function() {
    this.route('edit');
    this.route('changePassword');
  });
  this.resource('tourneys', function() {
    this.route('new');
  });
  this.resource('tourney', {path: 'tourneys/:id'});

  this.resource('gameday', function() {
    this.route('players');
    this.route('teams');
    this.route('matches');
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
App.AuthLoginRoute = require('./auth/login/route');
App.AuthLoginController = require('./auth/login/controller');
App.templates['auth/login'] = require('./auth/login/template');

// Logout
App.AuthLogoutRoute = require('./auth/logout/route');

// signup
App.AuthSignupRoute = require('./auth/signup/route');
App.AuthSignupController = require('./auth/signup/controller');
App.templates['auth/signup'] = require('./auth/signup/template');

// restore (password)
App.AuthRestoreRoute = require('./auth/restore/route');
App.AuthRestoreController = require('./auth/restore/controller');
App.templates['auth/restore'] = require('./auth/restore/template');

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

App.PlayerEditRoute = require('./player/edit/route');
App.PlayerEditController = require('./player/edit/controller');
App.PlayerEditPhotoEditView = require('./player/edit/photoEditView');
App.PlayerEditPhotoPreviewView = require('./player/edit/photoPreviewView');
// @TODO: use in template {{view NAME}} instead of helper
Ember.Handlebars.helper('player-photo-edit-view', App.PlayerEditPhotoEditView);
Ember.Handlebars.helper('player-photo-preview-view', App.PlayerEditPhotoPreviewView);
App.PlayerChangePasswordRoute = require('./player/changePassword/route');
App.PlayerChangePasswordController = require('./player/changePassword/controller');
App.templates['player/edit'] = require('./player/edit/template.hbs');
App.templates['player/changePassword'] = require('./player/changePassword/template.hbs');

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

// debug purpose
global.zApp = module.exports = App;
