var Ember = require('ember');

module.exports = Ember.Route.extend({
  activate: function() {
    console.warn('!!!!!!!!!!!!!!!!!!!!!!!');
  },

  // redirect: function(transition) {
  //   return this.get('session').logout()
  //     .then(function() {
  //       debugger;
  //       console.warn(this.get('session.user'));
  //       this.transitionTo('');
  //     }.bind(this));
  // }
});
