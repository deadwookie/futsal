var DS = require('ember-data');

module.exports = DS.Model.extend({
  tourney: DS.belongsTo('tourney', { async: true }),
  home: DS.belongsTo('team', { async: true }),
  away: DS.belongsTo('team', { async: true }),
  goals: DS.hasMany('goal', { async: true }),
  isPlayed: DS.attr('boolean', {
    defaultValue: false
  })
});
