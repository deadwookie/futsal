var fs = require('fs');
var path = require('path');
var self = path.basename(__filename);
var files = fs.readdirSync(__dirname);

files.forEach(function(task) {
  if (task === self || path.extname(task) !== '.js') {
    return;
  }

  require('./' + task);
});
