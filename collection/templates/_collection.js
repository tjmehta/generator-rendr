var <%= _.classify(name) %> = require('../models/<%= _.underscored(name) %>')
  , Base = require('./base');

module.exports = Base.extend({
  model: '<%= _.classify(name) %>',
  urlRoot: '/<%= _.underscored(name) %>s'
});

module.exports.id = "<%= _.classify(name) %>s";