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

// Give your handlebars.js templates some swag son!
// See http://elving.github.io/swag/
var Swag = require('swag');
// Hook until https://github.com/elving/swag/pull/49
if (window.Swag) Swag = window.Swag;
Swag.registerHelpers(Ember.Handlebars);

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
    var Auth = require('./auth');
    container.register('auth:main', Auth);
    container.injection('auth:main', 'store', 'store:main');
    container.injection('auth:main', 'adapter', 'firebase:login');

    container.injection('route', 'auth', 'auth:main');
    container.injection('controller', 'auth', 'auth:main');

    Ember.Route.reopen({
      beforeModel: function(transition, params) {
        if (this.get('isAuthRequired') && !this.get('auth.user')) {
          console.warn('auth is required for "%s"', transition.targetName);
          this.get('auth').set('attemptedTransition', transition);
          // TODO: show a "login required" message
          return this.transitionTo('auth');
        }
      },

      afterModel: function(model, transition) {
        var options = {
          atLeastOne: true,
          model: model
        };
        if (!this.get('auth').hasPermission(this.get('isPermissionRequired'), options)) {
          // TODO: show "no permission" message
          console.warn('no permission for "%s" on %o', transition.targetName, model.toJSON());
          // TODO: make redirect when login was previosly asked
          transition.abort();
        }
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

  this.resource('players', function() {
    this.route('player', {path: ':id'});

    this.resource('profile', {path: ':id/profile'}, function() {
      this.route('setup');
      this.route('password');
    });
  });

  this.resource('tourneys', function() {
    this.route('tourney', {path: ':id'});
    this.route('new');
  });

  this.resource('gameday', function() {
    this.route('players');
    this.route('teams');
    this.route('matches');
  });
});

// Models
App.Player = require('./_models/player');
App.Rating = require('./_models/rating');
App.Tourney = require('./_models/tourney');
App.Settings = require('./_models/settings');

// Application
App.ApplicationRoute = require('./application/route');
App.ApplicationController = require('./application/controller');
App.templates.application = require('./application/template.hbs');

// Auth
App.AuthIndexRoute = require('./auth/index/route');
App.templates.auth = require('./auth/template');

// login
App.AuthLoginRoute = require('./auth/login/route');
App.AuthLoginController = require('./auth/login/controller');
App.templates['auth/login'] = require('./auth/login/template');

// Logout
App.AuthLogoutRoute = require('./auth/logout/route');

// Sign Up
App.AuthSignupRoute = require('./auth/signup/route');
App.AuthSignupController = require('./auth/signup/controller');
App.templates['auth/signup'] = require('./auth/signup/template');

// Restore (password)
App.AuthRestoreRoute = require('./auth/restore/route');
App.AuthRestoreController = require('./auth/restore/controller');
App.templates['auth/restore'] = require('./auth/restore/template');

// Me
App.MeRoute = require('./me/route');

// Players
App.templates.players = require('./players/template.hbs');
App.PlayersIndexRoute = require('./players/index/route');
App.PlayersIndexController = require('./players/index/controller');
App.templates['players/index'] = require('./players/index/template.hbs');

// Player
App.PlayersPlayerRoute = require('./players/player/route');
App.PlayersPlayerController = require('./players/player/controller');
App.templates['players/player'] = require('./players/player/template.hbs');

// Profile
App.ProfileRoute = require('./profile/route');
App.templates.profile = require('./profile/template.hbs');

App.ProfileIndexRoute = require('./profile/index/route');

App.ProfileSetupController = require('./profile/setup/controller');
App.ProfileSetupPhotoEditView = require('./profile/setup/photoEditView');
App.ProfileSetupPhotoPreviewView = require('./profile/setup/photoPreviewView');
App.templates['profile/setup'] = require('./profile/setup/template.hbs');
// @TODO: use in template {{view NAME}} instead of helper
Ember.Handlebars.helper('player-photo-edit-view', App.ProfileSetupPhotoEditView);
Ember.Handlebars.helper('player-photo-preview-view', App.ProfileSetupPhotoPreviewView);

// Change Password
App.ProfilePasswordController = require('./profile/password/controller');
App.templates['profile/password'] = require('./profile/password/template.hbs');

// Voting
App.VotingRoute = require('./voting/route');
App.VotingController = require('./voting/controller');
App.templates.voting = require('./voting/template.hbs');

App.VotingPlayerController = require('./voting/player/controller');
App.VotingPlayerRoute = require('./voting/player/route');
App.templates['voting/player'] = require('./voting/player/template.hbs');

// Gameday
App.GamedayIndexRoute = require('./gameday/index/route');
App.templates.gameday = require('./gameday/template.hbs');
App.templates['gameday/players'] = require('./gameday/players.hbs');
App.templates['gameday/teams'] = require('./gameday/teams.hbs');
App.templates['gameday/matches'] = require('./gameday/matches.hbs');

// Tourney
App.TourneysTourneyRoute = require('./tourneys/tourney/route');
App.TourneysTourneyController = require('./tourneys/tourney/controller');
App.templates['tourneys/tourney'] = require('./tourneys/tourney/template.hbs');
App.templates['tourneys/new'] = require('./tourneys/tourney/mockup.hbs');

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

// Goal Model
App.Goal = require('./goal/model');

// Match
App.MatchRoute = require('./match/route');
App.MatchController = require('./match/controller');

// Matches
App.MatchesRoute = require('./matches/route');
App.MatchesController = require('./matches/controller');
App.templates.matches = require('./matches/template.hbs');


// debug purpose
global.zApp = module.exports = App;
