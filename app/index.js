'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var RunGenerator = module.exports = function RunGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);
};

util.inherits(RunGenerator, yeoman.generators.Base);

RunGenerator.prototype.help = function app() {
  console.log('Try one of these:');
  console.log('  `yo rendr:view <view-name>`');
  console.log('  `yo rendr:model <model-name>`');
  console.log('  `yo rendr:collection <collection-name>`');
  console.log('  `yo rendr:controller <controller-name>`');
};