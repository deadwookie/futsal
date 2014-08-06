var PlayerRoute = require('../player/route');

// An alias to existed player
module.exports = PlayerRoute.extend({
  templateName: 'player',
  // viewName: 'player',
  // controllerName: 'player',
  model: function() {
    return this._super({id: this.get('currentUserId')});
  }
});
