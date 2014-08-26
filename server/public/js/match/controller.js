var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  timeLeft: function() {
    return '4:32';
  }.property('isPlayed'),

  goalsHome: function() {
    return this.get('goals').filter(function(item, index, enumerable) {
      return item.get('team.id') == this.get('home.id');
    }.bind(this)).length;
  }.property('goals.@each.team'),

  goalsAway: function() {
    return this.get('goals').filter(function(item, index, enumerable) {
        return item.get('away.id') == this.get('away.id');
    }.bind(this)).length;
  }.property('goals.@each.team')
});

