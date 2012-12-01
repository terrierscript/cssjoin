#!/usr/bin/env node

var program = require('commander');
program
  .option("-d --debug", "Debugging")
  .usage("[options] <input>")
  .parse(process.argv);
var cssjoin = require("../lib/cssjoin.js");
var options = {};
cssjoin(program.args[0],options, function(err,result){
  if(err){
   process.stderr.write(err + "\n"); 
  }else{
    process.stdout.write(result);
  }
})

