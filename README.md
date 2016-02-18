# jpegquality

detect jpeg quality

# for commandline use

```sh
npm install jpegquality -g
jpegquality test.jpg
```

# use jpegquality locally

```sh
npm install jpegquality --save
```

```js
var fs = require('fs')
var jpegquality = require('jpegquality')

fs.readFile('./test.jpg', function (err, data) {
  var buf = new Buffer(data)
  var result = jpegquality(buf)
  console.log(result)
})
```
