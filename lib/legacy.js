



function trimQuote(syntax){
  if(/^'(.*)'$/.test(syntax)){
    syntax = syntax.replace(/^'/,'');
    syntax = syntax.replace(/'$/,'');
    return syntax
  }
  if(/^"(.*)"$/.test(syntax)){
    syntax = syntax.replace(/^"/,'');
    syntax = syntax.replace(/"$/,'');
    return syntax;
  }
  return syntax;
}

module.exports = {
  // css value can't parse url(hoge)
  findImportFile : function(syntax){
    var URL_REGEXP = /url\((.*)\)/

    if(URL_REGEXP.test(syntax)){
      var matches = syntax.match(URL_REGEXP);
      return trimQuote(matches[1])
    }
    var FILE_REGEXP = /"((?:[^"\\\r\n]|\\.)*)"|'((?:[^'\\\r\n]|\\.)*)'/;
    if(FILE_REGEXP.test(syntax)){
      var matches = syntax.match(FILE_REGEXP);
      var fileName = matches[1] || matches[2];
      return fileName
    }
  }

}