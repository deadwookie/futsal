var Ember = require('ember');
var md5 = require('MD5');

module.exports = Ember.ObjectController.extend({
  gravatar: function() {
    return 'http://www.gravatar.com/avatar/' + md5(this.get('model.email')) + '.jpg';
  }.property('email'),
  
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
