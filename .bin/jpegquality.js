#!/usr/bin/env node

var fs = require('fs')
var jpegquality = require('../lib/jpegquality.js')

process.env.DEBUG = true
fs.readFile(process.argv[2], function (err, data) {
  if (err) return console.error(err)
  var buf = new Buffer(data)
  jpegquality(buf)
})
