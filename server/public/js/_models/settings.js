var DS = require('ember-data');

module.exports = DS.Model.extend({
  teamsLimit: DS.attr('number'),
  playersPerTeam: DS.attr('number'),
  matchTime: DS.attr('number'),
  roundRobin: DS.attr('number'),
  playoff: DS.attr('number')
});
