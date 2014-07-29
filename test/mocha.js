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
  it("accepts no path option ", function(){
    // none
    var CssJoin = cssJoin("", {}, function(){});
    assert.deepEqual(CssJoin.getPaths("./test/fixture/simple/input.css"), 
                    ["./test/fixture/simple"]);
  });
  it("accepts a string path option ", function(){
    // string
    var CssJoin = cssJoin("", {paths : "/tmp"}, function(){});
    assert.deepEqual(CssJoin.getPaths(), ["/tmp"]);
    assert.deepEqual(CssJoin.getPaths("./test/fixture/simple/input.css"), 
                    ["./test/fixture/simple","/tmp"]);
  });
  it("accepts an array path option ", function(){
    // array 
    var CssJoin = cssJoin("", {paths : ["/tmp"]}, function(){});
    assert.deepEqual(CssJoin.getPaths(), ["/tmp"]);
    assert.deepEqual(CssJoin.getPaths("./test/fixture/simple/input.css"), 
                    ["./test/fixture/simple","/tmp"]);
  });

});

describe("resolve path", function(){
  describe('util', function () {
    it('resolves some patterns', function () {
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
    it("can't resolve a pattern for a missing file", function(){
      var result = utils._resolvePath("not.css",["./test/fixture/unknown"]);
      assert.equal(result, null);
    })
  });
  describe('lib', function () {
    it("Resolves path test", function(done){
      var opt = {
        paths : [
          "./test/fixture/resolve_path/input/htdocs",
          "./test/fixture/resolve_path/input/htdocs2"
        ]
      };
      cssJoin("./test/fixture/resolve_path/input/main.css", opt, 
        function(err ,result){
          var expect = read("./test/fixture/resolve_path/output/main.css");
          assert.equal(result, expect);
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
          assert.equal(stdout, expect);
          done();
        });
      });
    });
  });
})

describe("bin/cssjoin",function(){
  it("Executes without option", function(done){
    cp.exec("node bin/cssjoin.js ./test/fixture/basic/input/main.css",
      function(error, stdout, stderr){
        var expect = read("./test/fixture/basic/output/main.css");
        assert.equal(stdout, expect);
        done();
      }
    );
  });
});

describe("lib/cssjoin",function(){
  it("Executes with no options",function(done){
    cssJoin("./test/fixture/basic/input/main.css", function(err,result){
      var expect = read("./test/fixture/basic/output/main.css");
      assert.equal(result,expect);
      done();
    });
  });
  it("Executes with empty options",function(done){
    cssJoin("./test/fixture/basic/input/main.css",{}, function(err,result){
      var expect = read("./test/fixture/basic/output/main.css");
      assert.equal(result,expect);
      done();
    });
  });
  it("Executes with options non-destructively",function(done){
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
  it("Handles url @import ", function(done){
    cssJoin("./test/fixture/exist_url/input/main.css",
      function(err ,result){
        var expect = read("./test/fixture/exist_url/output/main.css");
        assert.equal(expect, result);
        done();
      }
    );
  });
  it("Handles url single quote @import ", function(done){
    cssJoin("./test/fixture/exist_url_single_quote/input/main.css",
      function(err ,result){
        var expect = read("./test/fixture/exist_url_single_quote/output/main.css");
        assert.equal(result, expect);
        done();
      }
    );
  });
  it("Handles url double quote @import ", function(done){
    cssJoin("./test/fixture/exist_url_double_quote/input/main.css",
      function(err ,result){
        var expect = read("./test/fixture/exist_url_double_quote/output/main.css");
        assert.equal(result, expect);
        done();
      }
    );
  });
  it("adjusts relative references to external resources",function(done){
    cssJoin("./test/fixture/url_resource/input/main.css",
      function(err,result){
        var expect = read("./test/fixture/url_resource/output/main.css");
        assert.equal(result, expect);
        done();
      }
    );
  });
  it("minified css",function(done){
    cssJoin("./test/fixture/minified/input/main.css",
      function(err,result){
        var expect = read("./test/fixture/minified/output/main.css");
        assert.equal(result, expect);
        done();
      }
    );
  });
  
  it("Throws an error option when it can't resolve an @import")  
  it("Creates a Map")
  it("Extend Test")
  it("Twice time called")
})

describe("util", function(){
  it("removes simple css comments", function(){    
    assert.equal( utils._removeComments("/* aa */ bb")," bb");
    assert.equal( utils._removeComments("/* aa */ bb /* cc */")," bb ");
  });
  it("removes css comment return codes", function(){
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
    var result = utils._removeComments(input);
    assert.equal(result,expect)
  });
  it("creates replace maps",function(){
    var cssFilePath = "./test/fixture/replace_map_test/dir/replace_map.css"
    var css = fs.readFileSync(cssFilePath, "utf-8");
    var result = utils.getReplaceMap(css,[path.dirname(cssFilePath)])
      var expect = {
        '@import "parts.css";' : "./test/fixture/replace_map_test/dir/parts.css",
      '@import "../base.css";' : "./test/fixture/replace_map_test/base.css"
      }
      //assert length
      assert.equal(expect.length, result.length);
      // assert result
      for(var key in expect){
        assert.equal(path.resolve(expect[key]),path.resolve(result[key]));
      }
  });
  it("finds import files", function(){
    var utils = rewire("../lib/util.js");
    var findImportFile = utils.__get__("findImportFile");
    assert.equal(findImportFile("@import url(./path.css)"), "./path.css");
    assert.equal(findImportFile("@import url('./path.css')"), "./path.css");
    assert.equal(findImportFile('@import url("./path.css")'), "./path.css");
    assert.equal(findImportFile("@import './path.css'"), "./path.css");
    assert.equal(findImportFile('@import "./path.css"'), "./path.css");
  })
})
