var utils = require("../lib/util.js");
var assert = require("assert");
var path = require("path");

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
