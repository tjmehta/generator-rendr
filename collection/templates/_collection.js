var Base = require('./base');

module.exports = Base.extend({
  urlRoot: '/<% _.slugify(this.name) %>s'
});

module.exports.id = <% _.classify(this.name) %>;