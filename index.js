var fs = require("fs");
var path = require("path");
var util = require("util");
var CssInclude = require("./lib/cssinclude.js");

module.exports = function(cssFilePath, options, cb){
  if (typeof options === "function") cb = options, options = {}
  if (!options) options = {};
  
  fs.readFile(cssFilePath, 'utf-8', function(err, data){
    if(err) throw err;
    
    var cssInclude = new CssInclude();
    var paths = options.path || [];
    paths.unshift(path.dirname(cssFilePath));
    var a = path.resolve(process.cwd(), cssFilePath);
    var css = cssInclude.extend(data, paths);
    var error = undefined;
    cb(error, css);
  })
}
