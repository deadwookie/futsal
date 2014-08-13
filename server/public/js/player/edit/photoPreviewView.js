var Ember = require('ember');
// @TODO: add mousewheel plugin to zoomIn/Out
var jqueryCropbox = require('jquery-cropbox');

module.exports = Ember.View.extend({
  attributeBindings: ['src'],
  tagName: 'img',

  // @TODO: add others from https://github.com/acornejo/jquery-cropbox
  attributes: ['width', 'height', 'showControls'],
  events: ['cropbox'],

  didInsertElement: function() {
    this._super();
    Ember.run.scheduleOnce('afterRender', this, this.afterRenderEvent);
  },

  // @TODO: rethink & improve
  afterRenderEvent: function() {
    var options = {};
    var self = this;

    this.get('events').forEach(function(event) {
      var callback = self[event];
      if (callback) {
        options[event] = callback
      }
    });

    this.get('attributes').forEach(function(attr) {
      if (self[attr] !== undefined) {
        options[attr] = self[attr];
      }
    });

    this.$().cropbox(options)
      .on('cropbox', function(event, results, img) {
        self.get('controller').set('photoCropped', img.getDataURL());
      });
  }
});
