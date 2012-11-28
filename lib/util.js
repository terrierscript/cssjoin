var fs = require("fs");
var path = require("path");
const IMPORT_REGEXP = /@import\s.+;/g;
const FILE_REGEXP = /"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/;


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

module.exports = {
  getReplaceMap : function(cssFilePath, resolvePaths, cb){
    var _replaceMap = {};
    fs.readFile(cssFilePath, 'utf-8',function(err, css){
      // get import sytax;
      var importMatches = css.match(IMPORT_REGEXP);
      for(var i=0; i < importMatches.length; i++ ){
        var importSyntax = importMatches[i];
        if(FILE_REGEXP.test(importSyntax) == false){
          continue;
        }
        var matches = importSyntax.match(FILE_REGEXP);
        var fileName = matches[1] || matches[2];
        if(/\.css$/.test(fileName) == false){
          continue;
        }
        var _resolvePaths = cloneArray(resolvePaths);
        _resolvePaths.unshift(path.dirname(cssFilePath));
        var file = resolvePath(fileName, _resolvePaths);
        if(!file){
          continue;
        }
        _replaceMap[importSyntax] = file;
      }
      cb(err,_replaceMap);
    });
  }
}
