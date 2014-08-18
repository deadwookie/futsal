var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  isFinished: function() {
    return this.get('model.matches').length > 0 && this.get('model.matches').filterBy('isPlayed', false).length === 0;
  }.property('matches'),

  matchesPlayed: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('home.id') === teamId || item.get('away.id') === teamId);
      });

    return matches.length;
  }.property('matches'),

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
  }.property('matches'),

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
  }.property('matches'),

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
  }.property('matches'),

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
  }.property('matches'),

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
  }.property('matches'),

  goalsDiff: function() {
    return this.get('goalsFor') - this.get('goalsAgainst');
  }.property('matches'),

  points: function() {
    return this.get('matchesWon') * 3 + this.get('matchesDraw') * 1;
  }.property('matches')
});
