var Ember = require('ember');

module.exports = Ember.ObjectController.extend({
  photoCropped: null,

  actions: {
    updateProfile: function() {
      var model = this.get('model');
      model.set('name', this.get('name'));
      model.set('photo', this.get('photoCropped') || this.get('photo'));
      model.set('isApproved', this.get('isApproved'));
      model.save();

      // todo: notify "profile updated"
      this.transitionToRoute('players.player', model);
    },
  }
});
