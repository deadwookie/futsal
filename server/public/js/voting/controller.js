var Ember = require('ember');

module.exports = Ember.ArrayController.extend({
  itemController: 'players.player',
  sortProperties: ['isVoted', 'rating'],
  sortAscending: false
});
