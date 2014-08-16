var DS = require('ember-data');

module.exports = DS.Model.extend({
  tourney: DS.belongsTo('tourney'),
  player: DS.belongsTo('player'),
  match: DS.belongsTo('match'),
  team: DS.belongsTo('team'),
  minute: DS.attr('number'),
  isOwn: DS.attr('boolean', {
    defaultValue: false
  }),
  isPenalty: DS.attr('boolean', {
    defaultValue: false
  })
});
