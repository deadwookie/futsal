var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  // todo: need: ['player']
  isVoted: function() {
    return this.get('rating') % 2;
  }.property('rating'),

  isLocked: function() {
    return this.get('isVoted') && this.get('id') % 2;
  }.property('isVoted')
});
