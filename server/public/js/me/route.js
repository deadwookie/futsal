var Ember = require('ember');
var PlayerRoute = require('../player/route');

// An alias to existed player
module.exports = PlayerRoute.extend({
  templateName: 'player',
  // viewName: 'player',
  controllerName: 'player',

  isAuthRequired: true,

  model: function() {
    var user = this.get('auth.user');
    return this._super({id: user.id});
  }
});
