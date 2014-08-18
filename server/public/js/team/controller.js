var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  playersSortedByRankDesc: ['rating:desc', 'name:asc'],
  playersSorderByRank: Ember.computed.sort('model.players', 'playersSortedByRankDesc'),

  // @TODO: calc player and team rating
  teamRank: function() {
    var players = this.get('players');

    return players.reduce(function(previousValue, player) {
      return previousValue + player.get('rating');
    }, 0);
  }.property('players.@each.ratings'),
});
