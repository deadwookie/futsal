var PlayerRoute = require('../player/route');
var user = {
  id: 13
};

// An alias to existed player
module.exports = PlayerRoute.extend({
  templateName: 'player',
  // viewName: 'player',
  // controllerName: 'player',
  model: function() {
    return this._super({id: user.id});
  }
});
