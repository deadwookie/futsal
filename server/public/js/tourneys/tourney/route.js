var Ember = require('ember');

module.exports = Ember.Route.extend({
  model: function(params) {
    // return this.store.find('tourney', params.id);
    return this.store.find('tourney', params.id)
      .then(function(tourney) {
        // @FIXME don't know how to figure out such problem: https://github.com/firebase/emberfire/issues/58#issuecomment-45366826
        return Ember.RSVP.Promise.cast(tourney.get('matches')).then(function(matches) {
          var goalsPromises = {};
          matches.forEach(function(match) {
            goalsPromises[match.get('id')] = Ember.RSVP.Promise.cast(match.get('goals'));
          });
          return Ember.RSVP.hash(goalsPromises).then(function(data) {
            return tourney;
          });
        });
      });
  }
});
