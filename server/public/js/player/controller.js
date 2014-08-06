var Ember = require('ember');
var md5 = require('MD5');

module.exports = Ember.ObjectController.extend({
  gravatar: function() {
    return 'http://www.gravatar.com/avatar/' + md5(this.get('model.email')) + '.jpg';
  }.property('email')
});
