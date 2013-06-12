var <%= _.classify(this.name) %> = require('../models/<%= _.underscored(this.name) %>')
  , Base = require('./base');

module.exports = Base.extend({
  model: '<% _.classify(this.name) %>',
  urlRoot: '/<% _.underscored(this.name) %>s'
});

module.exports.id = "<%= _.classify(name) %>s";