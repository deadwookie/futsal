var DS = require('ember-data');

module.exports = DS.Model.extend({
  tourney: DS.belongsTo('tourney'),
  home: DS.belongsTo('team'),
  away: DS.belongsTo('team'),
  goals: DS.hasMany('goal', { async: true }),
  isPlayed: DS.attr('boolean', {
    defaultValue: false
  })
});
