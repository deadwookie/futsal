var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  timeLeft: function() {
    return '4:32';
  }.property('isPlayed'),

  goalsHome: function() {
    return this.get('model.goals').filter(function(item, index, enumerable) {
      return item.get('team.id') == this.get('home.id');
    }.bind(this)).length;
  }.property('home', 'goals.@each.team'),

  goalsAway: function() {
    return this.get('model.goals').filter(function(item, index, enumerable) {
        return item.get('team.id') == this.get('away.id');
    }.bind(this)).length;
  }.property('away', 'goals.@each.team'),

  winHome: function() {
    return this.get('goalsHome') > this.get('goalsAway');
  }.property('home', 'away', 'goals.@each.team'),

  winAway: function() {
    return this.get('goalsHome') < this.get('goalsAway');
  }.property('home', 'away', 'goals.@each.team'),

  isHighlighted: function() {
    return this.get('home.highlighted') || this.get('away.highlighted');
  }.property('home.highlighted', 'away.highlighted')
});
