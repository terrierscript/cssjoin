var utils = require("../lib/util.js");
var assert = require("assert");
var path = require("path");
var fs = require("fs");
var cp = require("child_process");
var os = require("os");
var rewire = require("rewire");
var cssJoin = require("../lib/cssjoin.js");
//  var cssJoin = require("../");

var read = function(path){
  return fs.readFileSync(path,'utf-8');
}

var isWindows = function(){
  return os.type().match(/Windows/);
}

describe("lib/CssJoin Object", function () {
  it("none path option ", function(){
    // none
    var CssJoin = cssJoin("", {}, function(){});
    assert.deepEqual(CssJoin.getPaths("./test/fixture/simple/input.css"), 
                    ["./test/fixture/simple"]);
  });
  it("string path option ", function(){
    // string
    var CssJoin = cssJoin("", {paths : "/tmp"}, function(){});
    assert.deepEqual(CssJoin.getPaths(), ["/tmp"]);
    assert.deepEqual(CssJoin.getPaths("./test/fixture/simple/input.css"), 
                    ["./test/fixture/simple","/tmp"]);
  });
  it("array path option ", function(){
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
        ["./test/fixture/resolve_path/input","./test/fixture/resolve_path/input/htdocs/"]
      ];
      var expected = "test/fixture/resolve_path/input/htdocs/parts.css";
      if(isWindows()){
        expected = "test\\fixture\\resolve_path\\input\\htdocs\\parts.css";
      }
      for(var i=0; i < fileNamePattern.length; i++){
        for(var j=0; j < resolvePathPattern.length; j++){
          var result = utils._resolvePath(fileNamePattern[i], resolvePathPattern[j]);
          assert.equal(result, expected);
        }
      }
    });
    it("cant resolve pattern", function(){
      var result = utils._resolvePath("not.css",["./test/fixture/unknown"]);
      assert.equal(result, null);
    })
  });
  describe('lib', function () {
    it("Resolve path test", function(done){
      var opt = {
        paths : [
          "./test/fixture/resolve_path/input/htdocs",
          "./test/fixture/resolve_path/input/htdocs2"
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
      "./test/fixture/resolve_path/input/main.css"
    ]
    var paths;
    if(isWindows()){
      paths = "./test/fixture/resolve_path/input/htdocs;"
                +"./test/fixture/resolve_path/input/htdocs2";
    }else{
      paths = "./test/fixture/resolve_path/input/htdocs:"
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
  it("Execute with empty option",function(done){
    cssJoin("./test/fixture/basic/input/main.css",{}, function(err,result){
      var expect = read("./test/fixture/basic/output/main.css");
      assert.equal(expect, result);
      done();
    });
  });
  it("Execute with option not destructive",function(done){
    var opt = {paths : "/hoge"};
    cssJoin("./test/fixture/basic/input/main.css",opt, function(err,result){
      assert.deepEqual(opt, {paths : "/hoge"});
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
  it("url @import ", function(done){
    cssJoin("./test/fixture/exist_url/input/main.css",
      function(err ,result){
        var expect = read("./test/fixture/exist_url/output/main.css");
        assert.equal(expect, result);
        done();
      }
    );
  });
  it("url single quate @import ", function(done){
    cssJoin("./test/fixture/exist_url_single_quate/input/main.css",
      function(err ,result){
        var expect = read("./test/fixture/exist_url_single_quate/output/main.css");
        assert.equal(expect, result);
        done();
      }
    );
  });
  it("url double quate @import ", function(done){
    cssJoin("./test/fixture/exist_url_double_quate/input/main.css",
      function(err ,result){
        var expect = read("./test/fixture/exist_url_double_quate/output/main.css");
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
  it("css removing comment simple", function(){    
    assert.equal( utils._removeComment("/* aa */ bb")," bb");
    assert.equal( utils._removeComment("/* aa */ bb /* cc */")," bb ");
  });
  it("css removing comment return code", function(){
    // remove css
    var input = "/* hoge\n"
              + "age\n"
              + "*/\n"
              + "/* hoge\n\r"
              + "age\n\r"
              + "nr */\n\r"
              + "boke\n"
              + "uga\n"
              + "/* fuga */";
    var expect = "\n"
               +"\n\rboke\n"
               +"uga\n";
    var result = utils._removeComment(input);
    assert.equal(result,expect)
  });
  it("Replace map",function(){
    var cssFilePath = "./test/fixture/replace_map_test/dir/replace_map.css"
    var css = fs.readFileSync(cssFilePath, "utf-8");
    var result = utils.getReplaceMap(css,[path.dirname(cssFilePath)])
      var expect = {
        '@import "parts.css";' : "./test/fixture/replace_map_test/dir/parts.css",
      '@import "../base.css";' : "./test/fixture/replace_map_test/base.css"
      }
      //assert length
      assert.equal(expect.length, result.length);
      // assert reuslt
      for(var key in expect){
        assert.equal(path.resolve(expect[key]),path.resolve(result[key]));
      }
  });
  it("findImportFile", function(){
    var utils = rewire("../lib/util.js");
    var findImportFile = utils.__get__("findImportFile");
    assert.equal(findImportFile("@import url(./path.css)"), "./path.css");
    assert.equal(findImportFile("@import url('./path.css')"), "./path.css");
    assert.equal(findImportFile('@import url("./path.css")'), "./path.css");
    assert.equal(findImportFile("@import './path.css'"), "./path.css");
    assert.equal(findImportFile('@import "./path.css"'), "./path.css");
  })
})