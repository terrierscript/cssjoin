var fs = require("fs");
var path = require("path");
var clone = require("clone");
var reworkcss = require('css')
var parseCssValue = require('css-value')
var legacy = require('./legacy')


/**
 * Find existent file.
 * @see less/lib/index.js
 * @param  {String} file  Search file
 * @param  {Array}  paths Search paths
 * @return {String}
 */
function resolvePath(file, resolvePaths){
  var pathname = null;
  //paths
  var paths = resolvePaths.concat(); //deep copy
  paths.unshift('.');
  for (var i = 0; i < paths.length; i++) {
    try {
      pathname = path.join(paths[i], file);
      fs.statSync(pathname);
      return pathname;
    } catch (e) {
      pathname = null;
    }
  }
  return pathname;
}

function getReplaceMap(css, resolvePaths){
  var _replaceMap = {};
  var parsed = reworkcss.parse(css)
  var importRules = parsed.stylesheet.rules.filter(function(rule){
    return (rule.type == "import")
  })
  
  importRules.forEach(function(rule){
    var importValue = rule.import
    
    var fileName
    try{
      var valueParsed = parseCssValue(importValue)
      fileName = parseCssValue(importValue).value
    }catch(e){
      fileName = legacy.findImportFile(importValue)
      
    }
    var file = resolvePath(fileName, resolvePaths);
    if(!file){
      return
    }

    var importStringify = reworkcss.stringify({
      stylesheet : { rules : [ rule ] }
    })
    //console.log(importStringify, file)

    _replaceMap[importStringify] = file
  })
  return _replaceMap
}

function getUrlMap(css, resolvePaths, relativeBase) {
  var URL_REGEXP = /url\(.*?\)/g;
  var urlMap = {};
  var urlMatches = css.match(URL_REGEXP);
  if(urlMatches === null){
    return urlMap;
  }
  for(var i=0; i < urlMatches.length; i++ ){
    var urlSyntax = urlMatches[i];

    var fileName = legacy.findImportFile(urlSyntax)
    if(/\.css$/.test(fileName) !== false){
      continue;
    }
    var file = resolvePath(fileName, resolvePaths);
    if(!file){
      continue;
    }
    var relativePath = path.relative(relativeBase, file).replace(/\\/g, '/');
    urlMap[urlSyntax] = 'url("'+relativePath+'")';
  }
  return urlMap;
}

module.exports = {
  _resolvePath : resolvePath,
  getReplaceMap : getReplaceMap,
  getUrlMap : getUrlMap,
  getReplaceMapByFile : function(cssFilePath, resolvePaths, cb){
    var _this = this;
    // add resolve path
    var _resolvePaths = cloneArray(resolvePaths);
    _resolvePaths.unshift(path.dirname(cssFilePath));
    // read file
    fs.readFile(cssFilePath, 'utf-8', function(err, css){
      var _replaceMap = _this.getReplaceMap(css, _resolvePaths);
      cb(err, _replaceMap);
    });
  }
}
