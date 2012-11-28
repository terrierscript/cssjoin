/**
 * cssinclude.js
 *
 * extend syntax like @import "some.css"
 * to actualy css file contents when imported css exist.
 * If imported css file isn't exist, not execute replace.
 *
 * * usage *
 * var cssString
 * cssString = require('./cssinclude').extend(cssString);
 * 
 *
 */
function cloneArray(array){
  return array.concat();
}

/**
 * Find exist file.
 * @see less/lib/index.js
 * @param  {String} file  Search file
 * @param  {Array}  paths Search paths
 * @return {String}
 */
function resolvePath(file, resolvePaths){
  var pathname;
  //paths
  var paths = cloneArray(resolvePaths);
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
  console.warn("[WARN]Cannot resolve path: "+ file);
  return pathname;
}

var path = require('path');
var fs = require("fs");


var CssInclude = function(){
};


CssInclude.prototype.getImports = function(css){
  var cssPaths = [];
  var importMap = mapping(css);
}

/**
 * Extend import if css file exist
 * @param  {String} css   css content string
 * @param  {Array}  paths import resolve path
 * @return {String}       extended css
 */
CssInclude.prototype.extend = function(css, paths){
  var regexp = /@import\s.+;/g
  var importMatches = css.match(regexp);
  if(importMatches == null){
    return css;
  }


  for(var i=0; i < importMatches.length ; i++){
    css = this.replaceImport(css, paths, importMatches[i]);
  }
  
  return css;
}

CssInclude.prototype.replaceImport = function(css, paths, importSyntax){
  // @see less.js/parser.js
  var fileRegexp = /"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/;
  if(fileRegexp.test(importSyntax) == false){
    return css;
  }

  var matches = importSyntax.match(fileRegexp);
  var fileName = matches[1] || matches[2];
  if(/\.css$/.test(fileName) == false){
    return css;
  }

  var filePath = resolvePath(fileName, paths);
  if(filePath){
    var cssString = fs.readFileSync(filePath,'utf8');
    css = css.replace(importSyntax, cssString);
  }
  return css;
}

module.exports = CssInclude;
