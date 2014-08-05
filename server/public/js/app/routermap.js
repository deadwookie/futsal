module.exports = function() {
  this.route('me', {path: '/'});
  this.resource('players');
  this.resource('player', {path: 'players/:id'});
  this.resource('tourneys');
};
