var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  goalsScoredSortedDesc: ['goalsCnt:desc'],
  goalsScoredSorted: Ember.computed.sort('goalsScored', 'goalsScoredSortedDesc'),

  highlightedTeam: null,

  isFinished: function() {
    return this.get('matches') && this.get('matches').length > 0 && this.get('matches').filterBy('isPlayed', false).length === 0;
  }.property('matches.@each.isPlayed'),

  goalsScored: function() {
    var goalsScored = {};

    this.get('goals').forEach(function(goal, index) {
      if (goalsScored[goal.get('player.id')]) {
        goalsScored[goal.get('player.id')].goalsCnt += 1;
        goalsScored[goal.get('player.id')].goals.push(goal);
      } else {
        goalsScored[goal.get('player.id')] = {
          player: goal.get('player'),
          goals: [goal],
          goalsCnt: 1,
          isHighlighted: this.get('highlightedTeam') == goal.get('team')
        };
      }
    }.bind(this));

    return Object.keys(goalsScored).map(function(key) {
        return goalsScored[key];
    });
  }.property('goals.@each.player', 'highlightedTeam'),

  actions: {
    highlight: function(team) {
      this.get('teams').forEach(function(t, i) {
        t.set('highlighted', false);
      });
      if (team) {
        team.set('highlighted', true);
      }
      this.set('highlightedTeam', team || null);
    }
  }
});
