var DS = require('ember-data');

module.exports = DS.Model.extend({
  sho: DS.attr('number'),
  pas: DS.attr('number'),
  dri: DS.attr('number'),
  pac: DS.attr('number'),
  def: DS.attr('number'),
  gk: DS.attr('number')
});
