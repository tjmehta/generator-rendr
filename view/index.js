'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;

var ViewGenerator = module.exports = function ViewGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  // console.log('You called the view subgenerator with the argument ' + this.name + '.');
};

util.inherits(ViewGenerator, yeoman.generators.NamedBase);

ViewGenerator.prototype.generateControllerIfNotExists = function () {
  var cb = this.async();
  var underscoredName = this._.underscored(this.name);
  var nameSplit = underscoredName.split('_');
  var filename = nameSplit.pop();
  var controllerName = nameSplit[0];
  var keyname = filename;
  var controllerFilename = controllerName + '_controller.js';
  var controllerPath = path.join(process.cwd(), 'app', 'controllers', controllerFilename);

  if (!fs.existsSync(controllerPath)) {
    console.log('Generating ', controllerName, 'controller');
    var controllerGenCmd = 'yo rendr:controller '+controllerName;
    exec(controllerGenCmd, function (err, stdout, stderr) {
      if (err) {
        console.log("Command failed: '%s' with error %s", controllerGenCmd, err.message);
      }
      console.log(stderr);
      console.log(stdout);
      cb();
    });
  }
  else {
    cb();
  }
};

ViewGenerator.prototype.files = function files() {
  var underscoredName = this._.underscored(this.name);
  var nameSplit = underscoredName.split('_');
  var filename = nameSplit.pop();
  var controllerName = nameSplit[0];
  var keyname = filename;
  var viewPath = path.join.apply(path,
    ['app', 'views'].concat(nameSplit).concat([filename+'.js'])
  );
  var templatePath = path.join.apply(path,
    ['app', 'templates'].concat(nameSplit).concat([filename+'.hbs'])
  );

  // create template and view
  this.template('_view.js', viewPath, {name:this.name.replace('_', '/')});
  this.copy('view.hbs', templatePath);

  // create controller if it doens't exist
  var controllerFilename = controllerName + '_controller.js';
  var controllerPath = path.join(process.cwd(), 'app', 'controllers', controllerFilename);
  var controller = require(controllerPath.replace(/[.]js$/, ''));
  if (!controller[keyname]) {
    // var controllerRelPath = path.join('.', 'app', 'controllers', controllerName);
    // var controller = require(controllerRelPath);
    var controllerStr = this.readFileAsString(controllerPath);
    var indexToInsert = (function () {
      var string = controllerStr, i = 0, indexOfParen = 0;
      while (i < 2) {
        indexOfParen = string.lastIndexOf('}');
        if (!~indexOfParen) return -1;
        string = string.slice(0, indexOfParen);
        i++;
      }
    })();
    if (~indexToInsert) {
      indexToInsert++;
      var textToInsert = [
        ',',
        '  '+keyname+': function (params, callback) {',
        "    // var spec = {",
        "    //   collection: {collection: 'Collection', params: params}",
        "    // };",
        "    // this.app.fetch(spec, function(err, result) {",
        "    //   callback(err, '<% _.underscored(this.name) %>_index_view', result);",
        "    // });",
        '    callback();',
        '  }'
      ].join('\n');

      var newControllerText = controllerStr.slice(0, indexToInsert)
        + textToInsert + controllerStr.slice(indexToInsert, controllerStr.length);

      this.write(controllerPath, newControllerText);
    }
    else {
      console.log('Problem appending to controller: Parens not found.');
    }
  }
};
