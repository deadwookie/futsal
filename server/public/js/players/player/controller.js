var Ember = require('ember');
var md5 = require('MD5');

module.exports = Ember.ObjectController.extend({
  ratingAvg: function() {
    var r = this.get('ratings'),
      avg = r && (r.get('sho') + r.get('pas') + r.get('dri') + r.get('pac') + r.get('def') + r.get('gk')) / 6;

    return avg ? avg.toFixed(1) : 0;
  }.property('ratings'),

  gravatar: function() {
    return 'http://www.gravatar.com/avatar/' + md5(this.get('model.email')) + '.jpg';
  }.property('email'),

  isCurrentUser: function() {
    return this.get('id') === this.get('auth.user.id');
  }.property('auth.user', 'id'),

  votesCount: function() {
    var votes = this.get('votedBy');
    return votes ? Object.keys(votes).length : 0;
  }.property('votedBy'),

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
