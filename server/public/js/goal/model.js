var DS = require('ember-data');

module.exports = DS.Model.extend({
  tourney: DS.belongsTo('tourney', { async: true }),
  match: DS.belongsTo('match', { async: true }),
  team: DS.belongsTo('team', { async: true }),
  player: DS.belongsTo('player', { async: true }),
  minute: DS.attr('number'),
  isOwn: DS.attr('boolean', {
    defaultValue: false
  }),
  isPenalty: DS.attr('boolean', {
    defaultValue: false
  })
});
