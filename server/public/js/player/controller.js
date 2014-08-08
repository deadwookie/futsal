var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  isVoted: function() {
    return this.get('rating') % 2;
  }.property('rating'),

  isGoingTo: function() {
    return this.get('name').length % 2;
  }.property('name'),

  isLocked: function() {
    return this.get('isVoted') && this.get('id') % 2;
  }.property('isVoted')
});
