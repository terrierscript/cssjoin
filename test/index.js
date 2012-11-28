var fs = require("fs");
var path = require("path");
var assert = require("assert");
var index = require("../index.js");
var utils = require("../lib/util.js");

console.log("test start");

utils.getReplaceMap("./test/input/dir/replace_map.css",[],function(err,result){
  var expect = {
    '@import "parts.css";' : "./test/input/dir/parts.css",
    '@import "../base.css";' : "./test/input/base.css",
  }
  //assert length
  assert.equal(expect.length, result.length);
  // assert reuslt
  for(var key in expect){
    assert.equal(path.resolve(expect[key]),path.resolve(result[key]));
  }
});
/*
index("./test/input/main.css",function(err,data){
  var output = fs.readFileSync("./test/output/main.css", 'utf-8');
  assert.equal(data,output);
})
*/
