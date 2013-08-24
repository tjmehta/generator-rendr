'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var exec = require('child_process').exec;
var inflections = require('underscore.inflections');

var ViewGenerator = module.exports = function ViewGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  // console.log('You called the view subgenerator with the argument ' + this.name + '.');
};

util.inherits(ViewGenerator, yeoman.generators.NamedBase);

ViewGenerator.prototype.modelFiles = function () {
  var cb = this.async();
  this._.mixin(inflections)
  this.modelName = this._.singularize(this.name);
  var modelGenCmd = 'yo rendr:model '+this.modelName;
  exec(modelGenCmd, function (err, stdout, stderr) {
    if (err) {
      console.log("Command failed: '%s' with error %s", modelGenCmd, err.message);
    }
    console.log(stderr);
    console.log(stdout);
    cb();
  });
}

ViewGenerator.prototype.files = function files() {
  var name = this._.underscored(this.name);
  this.template('_collection.js', 'app/collections/'+name+'.js');
};
