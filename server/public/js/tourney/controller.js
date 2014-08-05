var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  isFinished: function() {
    return this.get('model.matches').length > 0 && this.get('model.matches').filterBy('isPlayed', false).length === 0;
  }.property('matches'),

  getMatchesPlayed: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('team1.id') === teamId || item.get('team2.id') === teamId);
      });

    return matches.length;
  }.property('matches'),

  getMatchesWon: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('team1.id') === teamId && item.get('team1goals') > item.get('team2goals')) || (item.get('team2.id') === teamId && item.get('team2goals') > item.get('team1goals'));
      });

    return matches.length;
  }.property('matches'),

  getMatchesDraw: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('team1.id') === teamId || item.get('team2.id') === teamId) && item.get('team1goals') === item.get('team2goals');
      });

    return matches.length;
  }.property('matches'),

  getMatchesLost: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('team1.id') === teamId && item.get('team1goals') < item.get('team2goals')) || (item.get('team2.id') === teamId && item.get('team2goals') < item.get('team1goals'));
      });

    return matches.length;
  }.property('matches'),

  getGoalsFor: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('team1.id') === teamId || item.get('team2.id') === teamId);
      });

    return matches.reduce(function(previousValue, match) {
      var goals = match.get('team1.id') === teamId ? match.get('team1goals') : match.get('team2goals');
      return previousValue + goals;
    }, 0);
  }.property('matches'),

  getGoalsAgainst: function() {
    var teamId = this.get('model.id'),
      matches = this.parentController.get('model.matches').filterBy('isPlayed', true).filter(function(item, index, enumerable) {
        return (item.get('team1.id') === teamId || item.get('team2.id') === teamId);
      });

    return matches.reduce(function(previousValue, match) {
      var goals = match.get('team1.id') === teamId ? match.get('team2goals') : match.get('team1goals');
      return previousValue + goals;
    }, 0);
  }.property('matches'),

  getGoalsDiff: function() {
    return this.get('getGoalsFor') - this.get('getGoalsAgainst');
  }.property('matches'),

  getPoints: function() {
    return this.get('getMatchesWon') * 3 + this.get('getMatchesDraw') * 1;
  }.property('matches'),
});
