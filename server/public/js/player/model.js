var DS = require('ember-data');

module.exports = DS.Model.extend({
  name: DS.attr('string'),
  photo: DS.attr('string'),
  rating: DS.attr('number')
});
