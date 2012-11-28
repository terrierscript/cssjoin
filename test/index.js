var fs = require("fs");
var assert = require("assert");
var index = require("../index.js");

index("./test/input/main.css",function(err,data){
  var output = fs.readFileSync("./test/output/main.css", 'utf-8');
  assert.equal(data,output);
})

