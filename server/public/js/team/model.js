var DS = require('ember-data');

module.exports = DS.Model.extend({
  name: DS.attr('string'),
  tourney: DS.belongsTo('tourney'),
  players: DS.hasMany('player', { async: true }),
  matches: DS.hasMany('match', { async: true }),
  goals: DS.hasMany('goal', { async: true })
});
