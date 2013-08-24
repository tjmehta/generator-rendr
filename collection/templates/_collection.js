var <%= _.classify(name) %> = require('../models/<%= _.underscored(name) %>')
  , Base = require('./base')
  , <%= _.classify(modelName) %> = require('../models/<%= _.underscored(modelName) %>');

module.exports = Base.extend({
  model: <%= _.classify(modelName) %>,
  urlRoot: '/<%= _.underscored(name) %>'
});

module.exports.id = "<%= _.classify(name) %>s";