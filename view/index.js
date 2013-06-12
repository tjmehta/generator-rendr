'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');
var path = require('path');
var fs = require('fs');

var ViewGenerator = module.exports = function ViewGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  // console.log('You called the view subgenerator with the argument ' + this.name + '.');
};

util.inherits(ViewGenerator, yeoman.generators.NamedBase);

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
  var controllerName = controllerName + '_controller.js';
  var controllerPath = path.join(process.cwd(), 'app', 'controllers', controllerName);

  if (!fs.existsSync(controllerPath)) {
    this.hookFor('rendr:controller', {
      args: [controllerName]
    });
  }
  var controller = require(controllerPath.replace(/[.]js$/, ''));
  if (controller[keyname]) {
    console.log('Controller logic not generated: already exists.');
  }
  else {
    // var controllerRelPath = path.join('.', 'app', 'controllers', controllerName);
    // var controller = require(controllerRelPath);
    var controllerStr = this.readFileAsString(controllerPath);
    var parenIndices = [];
    (function findLastTwoParens (indices) {
      var twoCount = [0,1];
      var string = controllerStr;
      twoCount.forEach(function () {
        var lastParenMath = string.match(/[ ]*\}[ \n;]*$/);
        if (lastParenMath) {
          indices.unshift(lastParenMath.index);
        }
        string = string.slice(0, lastParenMath.index-1);
      });
    }(parenIndices));
    if (parenIndices.length === 2) {
      var indexToInsert = parenIndices[0]+3; // 2nd to last paren + 1 char
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
