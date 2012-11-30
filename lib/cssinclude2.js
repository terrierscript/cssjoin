
var inutil = require("./util.js");
var util = require("util");
var fs = require("fs");
var path = require("path");

var replaceMap = {};
var cssContent = {};

var CssInclude = {
  replaceMap : {},
  cssContent : {}
}

module.exports = function(cssFile, options, cb){
  if (typeof options === "function") cb = options, options = {}
  if (!options) options = {};
  parseCss(cssFile, [], function(err, file){
    var css = extend(cssContent[file], cssFile);
    if(typeof cb === "function"){
      cb(err, css);
    }
  });
};


function extend(css, file){
  var map = replaceMap[file];
  for(var pattern in map){
    var child = map[pattern];
    css = css.replace(pattern, cssContent[child]);
    
    // recursive
    css = extend(css, child);
  }
  return css;
}

function parseCss(cssFilePath, resolvePaths, callback) {
  
  if(cssContent[cssFilePath] && replaceMap[cssFilePath]){ 
    callback(null, cssFilePath);
    return;
  }
  
  var _importTree = {};
  var _resolvePaths = inutil.cloneArray(resolvePaths);
  _resolvePaths.unshift(path.dirname(cssFilePath));
  
  fs.readFile(cssFilePath, 'utf-8', function(err, css){
    var _replaceMap = inutil.getReplaceMap(css, _resolvePaths);
    cssContent[cssFilePath] = css;
    replaceMap[cssFilePath] = _replaceMap;
    
    var length = Object.keys(_replaceMap).length;
    if(length == 0){
      callback(err, cssFilePath, {}); 
      return;
    }
    // recursive children
    var childlen = length;
    for(var key in _replaceMap){
      var _childFilePath = _replaceMap[key];
      parseCss(_childFilePath, resolvePaths, function(err, childFilePath){
        childlen--;
        
        if(childlen > 0){
          return;
        }
        callback(err, cssFilePath);
      });
    }
  });
};
