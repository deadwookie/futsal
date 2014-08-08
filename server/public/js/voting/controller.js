var Ember = require('ember');

module.exports = Ember.ArrayController.extend({
  itemController: 'player',
  sortProperties: ['isVoted', 'rating'],
  sortAscending: false
});
