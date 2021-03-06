var DS = require('ember-data');

module.exports = DS.Model.extend({
  name: DS.attr('string'),
  date: DS.attr('string'),
  players: DS.hasMany('player', { async: true }),
  teams: DS.hasMany('team', { async: true }),
  matches: DS.hasMany('match', { async: true }),
  goals: DS.hasMany('goal', { async: true }),
  settings: DS.belongsTo('settings', { embedded: true }),
  isPlayed: DS.attr('boolean', {
    defaultValue: false
  })
});
