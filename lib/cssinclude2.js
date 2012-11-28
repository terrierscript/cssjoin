var util = require("./util.js");
//private values
var replaceMap = {};
var importTree = {};

var CssInclude2 = function(cssFile){
  util.getReplaceMap(function(err, map){
    replaceMap[cssFile] = map;
    
    for(var key in map){
      var value = map[key];  
      importTree[cssFile] = {
        
      }
    }
  })
  
};

module.exports = CssInclude2;
