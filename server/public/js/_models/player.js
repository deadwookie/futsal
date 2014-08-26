var DS = require('ember-data');

module.exports = DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  photo: DS.attr('string'),
  rating: DS.attr('number'),
  ratings: DS.belongsTo('rating', {embedded: true}),
  isAdmin: DS.attr('boolean', { defaultValue: false }),
  isApproved: DS.attr('boolean', { defaultValue: false }),
  goals: DS.hasMany('goal', { async: true }),
  teams: DS.hasMany('team', { async: true }),
  tourneys: DS.hasMany('tourney', { async: true })
});
