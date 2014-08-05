var DS = require('ember-data');

module.exports = DS.Model.extend({
  tourney: DS.belongsTo('tourney'),
  team1: DS.belongsTo('team'),
  team2: DS.belongsTo('team'),
  team1goals: DS.attr('number'),
  team2goals: DS.attr('number'),
  isPlayed: DS.attr('boolean', {
    defaultValue: false
  }),
});
