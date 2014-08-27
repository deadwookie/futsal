var DS = require('ember-data');

module.exports = DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  photo: DS.attr('string'),
  rating: DS.attr('number'),
  ratings: DS.belongsTo('rating', { embedded: true }),
  isAdmin: DS.attr('boolean', { defaultValue: false }),
  isApproved: DS.attr('boolean', { defaultValue: false }),
  goals: DS.hasMany('goal'),
  teams: DS.hasMany('team'),
  tourneys: DS.hasMany('tourney'),
  ratingAvg: function() {
    var r = this.get('ratings'),
      avg = r && (r.get('sho') + r.get('pas') + r.get('dri') + r.get('pac') + r.get('def') + r.get('gk')) / 6;

    return avg ? parseFloat(avg.toFixed(1)) : 0;
  }.property('ratings')
});
