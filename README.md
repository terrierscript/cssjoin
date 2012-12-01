#CssJoin
Join css that @import syntax loaded file.

##Install
```sh
$ npm install -g cssjoin
```

##Usage
Command line
```sh
$ cssjoin some.css
```

in node.js
```javascript
var cssInclude = require('cssInclude');

cssInclude("sample.css",function(err,extendedCss){
  console.log(extendedCss);
});

```

##Example
### Input
main.css
```css
@import "dir/parts.css";

.main{
  float: left;
}
```
dir/parts.css
```css
.block{
  color:red;
}
```

####And execute
```sh
$ node bin/css-inclde.js main.css
```
### Output
```css
.block{
  color:red;
}

.main{
  float: left;
}
```
