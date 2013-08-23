var Base = require('./base');

module.exports = Base.extend({
  urlRoot: '/<%= _.underscored(name) %>s'
});

module.exports.id = "<%= _.classify(name) %>";