var DS = require('ember-data');

module.exports = DS.Model.extend({
  tourney: DS.belongsTo('tourney'),
  match: DS.belongsTo('match'),
  team: DS.belongsTo('team'),
  player: DS.belongsTo('player'),
  minute: DS.attr('number'),
  isOwn: DS.attr('boolean', {
    defaultValue: false
  }),
  isPenalty: DS.attr('boolean', {
    defaultValue: false
  })
});
