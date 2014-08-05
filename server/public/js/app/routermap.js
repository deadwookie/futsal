module.exports = function() {
  this.route('me', {path: '/'});
  this.resource('players');
  this.resource('player', {path: 'players/:id'});
  this.resource('tourneys');
  this.resource('tourney', {path: 'tourneys/:id'});
};
