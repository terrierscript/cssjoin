css-include
====

<!--
instal
```
npm install css-include
```
-->
usage
```
node bin/css-inclde.js some.css
```

```
var cssInclude = require('cssInclude');

cssInclude("sample.css",function(err,extendedCss){
  console.log(extendedCss);
});

```
