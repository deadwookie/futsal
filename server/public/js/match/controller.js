var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  actions: {
    view: function() {

    },
    edit: function() {

    }
  },

  timeLeft: function() {
    return '4:32';
  }.property('isPlayed'),
});
