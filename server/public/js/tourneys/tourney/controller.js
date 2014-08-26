var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  isFinished: function() {
    return this.get('model.matches') && this.get('model.matches').length > 0 && this.get('model.matches').filterBy('isPlayed', false).length === 0;
  }.property('matches.@each.isPlayed'),

  isWinner: function() {
    return !this.get('name') || this.get('name') === 'charlie' ? true : false;
  }.property('matches.@each.isPlayed'),

  matchesPlayed: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('home.id') === teamId || item.get('away.id') === teamId);
      });

    return matches.length;
  }.property('matches.@each.home', 'matches.@each.away'),

  matchesWon: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
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
  }.property('matches.@each.goals', 'matches.@each.goals.@each.team', 'matches.@each.home', 'matches.@each.away'),

  matchesDraw: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        var goalsHome = item.get('goals').filter(function(goal, index) {
            return goal.get('team.id') === item.get('home.id');
          }).length,
          goalsAway = item.get('goals').filter(function(goal, index) {
            return goal.get('team.id') === item.get('away.id');
          }).length;
        return (item.get('home.id') === teamId || item.get('away.id') === teamId) && goalsHome === goalsAway;
      });

    return matches.length;
  }.property('matches.@each.goals', 'matches.@each.goals.@each.team', 'matches.@each.home', 'matches.@each.away'),

  matchesLost: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
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
  }.property('matches.@each.goals', 'matches.@each.goals.@each.team', 'matches.@each.home', 'matches.@each.away'),

  goalsFor: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
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
  }.property('matches.@each.goals', 'matches.@each.goals.@each.team', 'matches.@each.home', 'matches.@each.away'),

  goalsAgainst: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
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
  }.property('matches.@each.goals', 'matches.@each.goals.@each.team', 'matches.@each.home', 'matches.@each.away'),

  goalsDiff: function() {
    return this.get('goalsFor') - this.get('goalsAgainst');
  }.property('matches.@each.goals', 'matches.@each.goals.@each.team', 'matches.@each.home', 'matches.@each.away'),

  points: function() {
    return this.get('matchesWon') * 3 + this.get('matchesDraw') * 1;
  }.property('matches.@each.goals', 'matches.@each.goals.@each.team', 'matches.@each.home', 'matches.@each.away')
});
