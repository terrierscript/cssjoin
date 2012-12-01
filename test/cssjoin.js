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
  var cssJoin = require("../lib/cssjoin.js");
  it("Execute with no option",function(done){
    cssJoin("./test/fixture/3/input/main.css", function(err,result){
      var expect = fs.readFileSync("./test/fixture/3/output/main.css",'utf-8');
      assert.equal(expect, result);
      done();
    });
  });
  it("Execute with option",function(done){
    cssJoin("./test/fixture/3/input/main.css",{debug :true }, function(err,result){
      var expect = fs.readFileSync("./test/fixture/3/output/main.css",'utf-8');
      assert.equal(expect, result);
      done();
    });
  });
  it("Resolve path test")
  it("Can't resolve @import test", function(done){
    cssJoin("./test/fixture/5/input/main.css,",{debug :true }, function(err ,result){
      var expect = fs.readFileSync("./test/fixture/5/output/main.css",'utf-8');
      //assert.equal(expect, result);
      done();
    });
  });
  it("Can't resolve @import test with error")  
  it("Create Map")
  it("Extend Test")
  it("Twice time called")
})
