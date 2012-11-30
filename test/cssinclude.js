var fs = require("fs");
var assert = require("assert");

describe("old css-include",function(){
  it("Test 1",function(done){
    var index = require("../index.js");
    index("./test/fixture/1/input/main.css",function(err,data){
      var output = fs.readFileSync("./test/fixture/1/output/main.css", 'utf-8');
      assert.equal(data,output);
      done();
    })
  })
});
describe("css-include2",function(){
  it("Execute with no option",function(done){
    var cssInclude2 = require("../lib/cssinclude2.js");
    cssInclude2("./test/fixture/3/input/main.css",function(err,result){
      
      var expect = fs.readFileSync("./test/fixture/3/output/main.css",'utf-8');
      assert.equal(expect, result);
      done();
    });
  });
  it("Twice time called")
  it("Create Map")
  it("Extend Test")
})
