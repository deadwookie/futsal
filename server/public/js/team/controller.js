var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  playersSortedByRankDesc: ['rating:desc', 'name:asc'],
  playersSorderByRank: Ember.computed.sort('model.players', 'playersSortedByRankDesc'),

  teamRank: function() {
    var players = this.get('players');

    return players.reduce(function(previousValue, user) {
      return previousValue + user.get('rating');
    }, 0);
  }.property('players.@each.rank'),
});
