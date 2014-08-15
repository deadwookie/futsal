var Ember = require('ember');

module.exports = Ember.TextField.extend({
  type: 'file',

  change: function(evt) {
    var input = evt.target;
    if (input.files && input.files[0]) {
        var self = this;

        var reader = new FileReader();
        reader.onload = function(ev) {
            var data = ev.target.result;
            self.set('parentView.content', data);
        }
        reader.readAsDataURL(input.files[0]);
    }
  }
});
