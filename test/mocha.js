var utils = require("../lib/util.js");
var assert = require("assert");
var path = require("path");
var fs = require("fs");
var cp = require("child_process");
var os = require("os");

var cssJoin = require("../lib/cssjoin.js");

var read = function(path){
  return fs.readFileSync(path,'utf-8');
}

var isWindows = function(){
  return os.type().match(/Windows/);
}

describe("lib/CssJoin Object", function () {
  it("path option ", function(){
    // none
    var CssJoin = cssJoin("", {}, function(){});
    assert.deepEqual(CssJoin.getPaths("./test/fixture/simple/input.css"), 
                    ["./test/fixture/simple"]);
    // string
    var CssJoin = cssJoin("", {paths : "/tmp"}, function(){});
    assert.deepEqual(CssJoin.getPaths(), ["/tmp"]);
    assert.deepEqual(CssJoin.getPaths("./test/fixture/simple/input.css"), 
                    ["./test/fixture/simple","/tmp"]);
    // array 
    var CssJoin = cssJoin("", {paths : ["/tmp"]}, function(){});
    assert.deepEqual(CssJoin.getPaths(), ["/tmp"]);
    assert.deepEqual(CssJoin.getPaths("./test/fixture/simple/input.css"), 
                    ["./test/fixture/simple","/tmp"]);
  });
});

describe("resolve path", function(){
  describe('util', function () {
    it('resolve some pattern', function () {
      var fileNamePattern = ["/parts.css" , "parts.css", "./parts.css"];
      var resolvePathPattern = [
        ["./test/fixture/resolve_path/input/htdocs"],
        ["./test/fixture/resolve_path/input/htdocs/"],
        ["test/fixture/resolve_path/input/htdocs"],
        ["test/fixture/resolve_path/input/htdocs/"],
        [".","./test/fixture/resolve_path/input/htdocs/"],
        ["./test/fixture/resolve_path/input","./test/fixture/resolve_path/input/htdocs/"],
      ];
      var expected = "test/fixture/resolve_path/input/htdocs/parts.css";
      if(isWindows()){
        expected = "test\\fixture\\resolve_path\\input\\htdocs\\parts.css";
      }
      for(var i=0; i < fileNamePattern.length; i++){
        for(var j=0; j < resolvePathPattern.length; j++){
          var result = utils.resolvePath(fileNamePattern[i], resolvePathPattern[j]);
          assert.equal(result, expected);
        }
      }
    });
    it("cant resolve pattern", function(){
      var result = utils.resolvePath("not.css",["./test/fixture/unknown"]);
      assert.equal(result, null);
    })
  });
  describe('lib', function () {
    it("Resolve path test", function(done){
      var opt = {
        paths : [
          "./test/fixture/resolve_path/input/htdocs",
          "./test/fixture/resolve_path/input/htdocs2",
        ]
      };
      cssJoin("./test/fixture/resolve_path/input/main.css", opt, 
        function(err ,result){
          var expect = read("./test/fixture/resolve_path/output/main.css");
          assert.equal(expect, result);
          done();
        }
      );
    });
  });
  describe("Bin execute with resolve path", function(){
    var command = [
      "node",
      "bin/cssjoin.js",
      "./test/fixture/resolve_path/input/main.css",
    ]
    if(isWindows()){
      var paths = "./test/fixture/resolve_path/input/htdocs;"
                +"./test/fixture/resolve_path/input/htdocs2";
    }else{
      var paths = "./test/fixture/resolve_path/input/htdocs:"
                +"./test/fixture/resolve_path/input/htdocs2";
    }
    var params = ["-p","--path","--include-path"];
    params.forEach(function(param){
      var _command = command.join(" ")+" "+param+" "+paths;
      it(param, function(done){
        //console.log(_command);
        cp.exec(_command,function(error, stdout, stderr){
          var expect = read("./test/fixture/resolve_path/output/main.css");
          assert.equal(stdout,expect);
          done();
        });
      });
    });
  });
})

describe("bin/cssjoin",function(){
  it("Execute without option", function(done){
    cp.exec("node bin/cssjoin.js ./test/fixture/basic/input/main.css",
      function(error, stdout, stderr){
        var expect = read("./test/fixture/basic/output/main.css");
        assert.equal(expect,stdout);
        done();
      }
    );
  });
});

describe("lib/cssjoin",function(){
  it("Execute with no option",function(done){
    cssJoin("./test/fixture/basic/input/main.css", function(err,result){
      var expect = read("./test/fixture/basic/output/main.css");
      assert.equal(expect, result);
      done();
    });
  });
  it("Execute with option",function(done){
    cssJoin("./test/fixture/basic/input/main.css",{}, function(err,result){
      var expect = read("./test/fixture/basic/output/main.css");
      assert.equal(expect, result);
      done();
    });
  });
  it("Can't resolve @import test", function(done){
    cssJoin("./test/fixture/cannot_import/input/main.css", 
      function(err ,result){
        var expect = read("./test/fixture/cannot_import/output/main.css");
        assert.equal(expect, result);
        done();
      }
    );
  });
  
  it("Throw error option when can't resolve @import")  
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
    utils.getReplaceMapByFile("./test/fixture/replace_map_test/dir/replace_map.css",[],function(err,result){
      var expect = {
        '@import "parts.css";' : "./test/fixture/replace_map_test/dir/parts.css",
        '@import "../base.css";' : "./test/fixture/replace_map_test/base.css",
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
