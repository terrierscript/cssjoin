
var inutil = require("./util.js");
var util = require("util");
var fs = require("fs");
var path = require("path");
//var replaceMap = {};
//var cssContent = {};


module.exports = function(cssFile, options, cb){
  if (typeof options === "function") cb = options, options = {}
  if (!options) options = {};
  var cssJoin = new CssJoin(cssFile, options);
  cssJoin.parseCss(cssFile, [], function(err, file){
    var css = cssJoin.extend(cssJoin.cssContent[file], cssFile);
    if(typeof cb === "function"){
      cb(err, css);
    }
  });
};

var CssJoin = function(cssFile, options){
  this.replaceMap = {};
  this.cssContent = {};
  this.option = options || {};
}

CssJoin.prototype.extend = function(css, file){
  var map = this.replaceMap[file];
  for(var pattern in map){
    var child = map[pattern];
    css = css.replace(pattern, this.cssContent[child]);
    
    // recursive
    css = this.extend(css, child);
  }
  return css;
}

CssJoin.prototype.parseCss = function(cssFilePath, resolvePaths, callback) {
  if(this.cssContent[cssFilePath] && this.replaceMap[cssFilePath]){ 
    callback(null, this.cssFilePath);
    return;
  }
  var _resolvePaths = inutil.cloneArray(resolvePaths);
  _resolvePaths.unshift(path.dirname(cssFilePath));
  var _this = this;
  fs.readFile(cssFilePath, 'utf-8', function(err, css){
    var _replaceMap = inutil.getReplaceMap(css, _resolvePaths);
    _this.cssContent[cssFilePath] = css;
    _this.replaceMap[cssFilePath] = _replaceMap;
    
    var length = Object.keys(_replaceMap).length;
    if(length == 0){
      callback(err, cssFilePath, {}); 
      return;
    }
    // recursive children
    var childlen = length;
    for(var key in _replaceMap){
      var _childFilePath = _replaceMap[key];
      _this.parseCss(_childFilePath, resolvePaths, function(err, childFilePath){
        childlen--;
        if(childlen > 0){
          return;
        }
        callback(err, cssFilePath);
      });
    }
  });
};
