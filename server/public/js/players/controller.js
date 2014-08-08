var Ember = require('ember');

module.exports = Ember.ArrayController.extend({
  itemController: 'player',

  sortProperties: ['rating'],
  sortAscending: false,

  playersSortedByRankDesc: ['rating:desc', 'name:asc'],
  playersSorderByRank: Ember.computed.sort('model', 'playersSortedByRankDesc'),
});
