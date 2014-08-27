var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  playersSortedByRankDesc: ['ratingAvg:desc', 'name:asc'],
  playersSortedByRank: Ember.computed.sort('model.players', 'playersSortedByRankDesc'),

  teamRank: function() {
    var players = this.get('players');

    return players.reduce(function(previousValue, player) {
      return previousValue + player.get('ratingAvg');
    }, 0);
  }.property('players.@each.ratings'),

  isWinner: function() {
    return !this.get('name') || this.get('name') === 'alpha' ? true : false;
  }.property('matches.@each.isPlayed'),

  ratingAvg: function() {
    var ratingAvg, sum = 0;

    this.get('players').forEach(function(player, index) {
      sum += player.get('ratingAvg');
    });

    ratingAvg = sum / this.parentController.get('settings.playersPerTeam');

    return ratingAvg ? parseFloat(ratingAvg.toFixed(1)) : 0;
  }.property('players.@each.ratingAvg'),

  matchesPlayed: function() {
    return this.get('matches').filterBy('isPlayed', true).length;
  }.property('matches.@each.isPlayed'),

  matchesWon: function() {
    var teamId = this.get('id'),
      matches = this.get('matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        var goalsHome = item.get('goals').filter(function(goal, index) {
            return goal.get('team.id') === item.get('home.id');
          }).length,
          goalsAway = item.get('goals').filter(function(goal, index) {
            return goal.get('team.id') === item.get('away.id');
          }).length;

        return (item.get('home.id') === teamId && goalsHome > goalsAway) ||
          (item.get('away.id') === teamId && goalsAway > goalsHome);
      });

    return matches.length;
  }.property('matches.@each.isPlayed', 'matches.@each.{home,away}', 'matches.@each.goals.@each.team'),

  matchesDraw: function() {
    var teamId = this.get('id'),
      matches = this.get('matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        var goalsHome = item.get('goals').filter(function(goal, index) {
            return goal.get('team.id') === item.get('home.id');
          }).length,
          goalsAway = item.get('goals').filter(function(goal, index) {
            return goal.get('team.id') === item.get('away.id');
          }).length;
        return (item.get('home.id') === teamId || item.get('away.id') === teamId) && goalsHome === goalsAway;
      });

    return matches.length;
  }.property('matches.@each.goals.@each.team', 'matches.@each.{home,away}'),

  matchesLost: function() {
    var teamId = this.get('id'),
      matches = this.get('matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        var goalsHome = item.get('goals').filter(function(goal, index) {
            return goal.get('team.id') === item.get('home.id');
          }).length,
          goalsAway = item.get('goals').filter(function(goal, index) {
            return goal.get('team.id') === item.get('away.id');
          }).length;
        return (item.get('home.id') === teamId && goalsHome < goalsAway) ||
          (item.get('away.id') === teamId && goalsAway < goalsHome);
      });

    return matches.length;
  }.property('matches.@each.goals.@each.team', 'matches.@each.{home,away}'),

  goalsFor: function() {
    var teamId = this.get('id'),
      matches = this.get('matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('home.id') === teamId || item.get('away.id') === teamId);
      });

    return matches.reduce(function(previousValue, match) {
      var goalsHome = match.get('goals').filter(function(goal, index) {
          return goal.get('team.id') === match.get('home.id');
        }).length,
        goalsAway = match.get('goals').filter(function(goal, index) {
          return goal.get('team.id') === match.get('away.id');
        }).length,
        goals = match.get('home.id') === teamId ? goalsHome : goalsAway;
      return previousValue + goals;
    }, 0);
  }.property('matches.@each.goals.@each.team', 'matches.@each.{home,away}'),

  goalsAgainst: function() {
    var teamId = this.get('id'),
      matches = this.get('matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('home.id') === teamId || item.get('away.id') === teamId);
      });

    return matches.reduce(function(previousValue, match) {
      var goalsHome = match.get('goals').filter(function(goal, index) {
          return goal.get('team.id') === match.get('home.id');
        }).length,
        goalsAway = match.get('goals').filter(function(goal, index) {
          return goal.get('team.id') === match.get('away.id');
        }).length,
        goals = match.get('home.id') === teamId ? goalsAway : goalsHome;
      return previousValue + goals;
    }, 0);
  }.property('matches.@each.goals.@each.team', 'matches.@each.{home,away}'),

  goalsDiff: function() {
    return this.get('goalsFor') - this.get('goalsAgainst');
  }.property('matches.@each.goals.@each.team', 'matches.@each.{home,away}'),

  points: function() {
    return this.get('matchesWon') * 3 + this.get('matchesDraw') * 1;
  }.property('matches.@each.goals.@each.team', 'matches.@each.{home,away}')
});
