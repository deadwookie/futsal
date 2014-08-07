var Ember = require('ember');
var DS = require('ember-data');

// todo: rethink!
Ember.Route.reopen({
  currentUserId: 13
});

var App = Ember.Application.create({
  LOG_TRANSITIONS: true
});
App.ApplicationAdapter = DS.FixtureAdapter.extend();
App.templates = Ember.TEMPLATES;

App.Router.map(function() {
  this.route('me', {path: '/'});
  this.resource('players');
  this.resource('player', {path: 'players/:id'});
  this.resource('tourneys', function() {
    this.route('new');
  });
  this.resource('tourney', {path: 'tourneys/:id'});

  this.resource('gameday', function() {

  });
});

// Application
App.ApplicationRoute = require('./app/route');
App.templates.application = require('./app/template.hbs');

// Gameday
// App.templates.gameday = require('./gameday/template.hbs');



// Player Model
App.Player = require('./player/model');
App.Player.FIXTURES = require('./player/fixtures.json');

// Players
App.PlayersRoute = require('./players/route');
App.PlayersController = require('./players/controller');
App.templates.players = require('./players/template.hbs');

// Player
App.PlayerRoute = require('./players/route');
App.templates.player = require('./player/template.hbs');


// Tourney Model
App.Tourney = require('./tourney/model');
App.Tourney.FIXTURES = require('./tourney/fixtures.json');

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
App.templates.tourneys = require('./tourneys/template.hbs');

// Team Model
App.Team = require('./team/model');
App.Team.FIXTURES = require('./team/fixtures.json');

// Team
App.TeamRoute = require('./team/route');
App.TeamController = require('./team/controller');

// Teams
App.TeamsRoute = require('./teams/route');
App.TeamsController = require('./teams/controller');
App.templates.teams = require('./teams/template.hbs');

// Match Model
App.Match = require('./match/model');
App.Match.FIXTURES = require('./match/fixtures.json');

// Match
App.MatchRoute = require('./match/route');
App.MatchController = require('./match/controller');

// Matches
App.MatchesRoute = require('./matches/route');
App.MatchesController = require('./matches/controller');
App.templates.matches = require('./matches/template.hbs');

// Me
App.MeRoute = require('./me/route');
