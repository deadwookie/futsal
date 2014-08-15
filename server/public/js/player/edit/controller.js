var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  needs: 'player',
  photoCropped: null,

  actions: {
    updateProfile: function() {
      var model = this.get('model');
      model.set('name', this.get('name'));
      model.set('photo', this.get('photoCropped') || this.get('photo'));
      model.set('isApproved', this.get('isApproved'));
      model.save();
      this.transitionToRoute('me');
    },
  }
});
