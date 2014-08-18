var Ember = require('ember');
var PlayerRoute = require('../players/player/route');

// An alias to existed player
module.exports = PlayerRoute.extend({
  templateName: 'players.player',
  // viewName: 'player',
  controllerName: 'players.player',

  isAuthRequired: true,

  model: function() {
    var user = this.get('session.user');
    return this._super({id: user.id});
  }
});
