var utils = require("../lib/util.js");
var assert = require("assert");
var path = require("path");
var fs = require("fs");

describe("lib/cssjoin",function(){
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

describe("util", function(){
  it("Clone array",function(){
    var a = [1,2,3];
    var b = utils.cloneArray(a);
    b[0] = 4;
    assert.deepEqual(a, [1,2,3]);
    assert.deepEqual(b, [4,2,3]);
  });
  it("css removing comment simple", function(){    
    assert.equal( utils.removeComment("/* aa */ bb")," bb");
    assert.equal( utils.removeComment("/* aa */ bb /* cc */")," bb ");
  });
  it("css removing comment return code", function(){
    // remove css
    var input = "/* hoge\n"+
    "age\n"+
    "*/\n"+
    "/* hoge\n\r"+
    "age\n\r"+
    "nr */\n\r"+
    "boke\n"+
    "uga\n"+
    "/* fuga */";
    var expect = "\n"
               +"\n\rboke\n"
               +"uga\n";
    var result = utils.removeComment(input);
    assert.equal(result,expect)
  });
  it("Replace map",function(){
    utils.getReplaceMapByFile("./test/fixture/2/dir/replace_map.css",[],function(err,result){
      var expect = {
        '@import "parts.css";' : "./test/fixture/2/dir/parts.css",
        '@import "../base.css";' : "./test/fixture/2/base.css",
      }
      //assert length
      assert.equal(expect.length, result.length);
      // assert reuslt
      for(var key in expect){
        assert.equal(path.resolve(expect[key]),path.resolve(result[key]));
      }
    });
  });
})
