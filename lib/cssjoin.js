
var inutil = require("./util.js");
var util = require("util");
var fs = require("fs");
var path = require("path");
//var replaceMap = {};
//var cssContent = {};
var debug = false;
console.debug = function(msg){
  if(debug){
    console.log(msg);
  }
}

module.exports = function(cssFile, options, cb){
  if(typeof options === "function") cb = options, options = {};
  if(!options) options = {};
  if(options.debug){
    debug = options.debug;
  }
  var cssJoin = new CssJoin(cssFile, options);
  cssJoin.parseCss(cssFile, [], function(err, file){
    //console.debug(cssJoin);
    var css = cssJoin.cssContent[file];
    css = cssJoin.extend(css,file);
    if(typeof cb === "function"){
      cb(err, css);
    }
  });
};

var CssJoin = function(cssFile, options){
  this.replaceMap = {};
  this.cssContent = {};
  this.option = options || {};
  this.baseFile = cssFile;
}


CssJoin.prototype.extend = function(joinedCss, file){  
  var map = this.replaceMap[file];
  for(var pattern in map){
    var child = map[pattern];
    var childCss = this.cssContent[child];
    
    if(childCss){
      joinedCss = joinedCss.replace(pattern, childCss);
    }
    // recursive
    joinedCss = this.extend(joinedCss, child);
  }
  return joinedCss;
}

CssJoin.prototype.parseCss = function(cssFilePath, resolvePaths, callback) {
  if(this.cssContent[cssFilePath] && this.replaceMap[cssFilePath]){ 
    callback(null, this.cssFilePath);
    return;
  }
  var _resolvePaths = inutil.cloneArray(resolvePaths);
  _resolvePaths.unshift(path.dirname(cssFilePath));
  var _this = this;
  fs.stat(cssFilePath, function(err, result){
    if(result == undefined){
      callback(null, this.cssFilePath);
      return;
    }
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
      var children = length;
      for(var key in _replaceMap){
        var _childFilePath = _replaceMap[key];
        
        _this.parseCss(_childFilePath, resolvePaths, function(err, childFilePath){
          children--;
          if(children > 0){
            return;
          }
          callback(err, cssFilePath);
        });
      }
    });
  });
};
