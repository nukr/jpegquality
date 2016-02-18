var printf = require('./printf')
var log = function () {
  var args = Array.prototype.slice.call(arguments)
  if (process.env.DEBUG) {
    console.log.apply(console, args)
  }
}
var write = function () {
  var args = Array.prototype.slice.call(arguments)
  if (process.env.DEBUG) {
    process.stdout.write.apply(process.stdout, args)
  }
}

function avgTable (table, index) {
  var arr = []
  var total = 0

  log('Quantization table', index ? '(chrominance)' : '(luminance)')

  for (var i = 0; i < table.length; i += 2) {
    arr.push(table[i] + table[i + 1])
  }

  for (var j = 0; j < arr.length; j += 1) {
    var d = parseInt(arr[j], 16)
    if (j % 8 === 0) write('\n')
    printf('%4d', d)
    if (j !== 0) total += d
  }
  write('\n')
  var result = 100.0 - total / 63
  log('result = %' + result)
  return result
}

function extractTable (buf) {
  var arr = []
  for (var i = 0; i < buf.length; i += 1) {
    if (buf[i] === 255) {
      if (buf[i + 1] === 219) {
        arr.push(buf.slice(i + 5, i + 69).toString('hex'))
      }
    }
  }
  return arr
}

module.exports = function jpegquality (buf) {
  var tables = extractTable(buf)
  var avgs = tables.map((table, index) => avgTable(table, index))
  avgs[2] = avgs[1]
  var diff = Math.abs(avgs[0] - avgs[1]) * 0.49
  diff += Math.abs(avgs[0] - avgs[2]) * 0.49
  var quality = (avgs[0] + avgs[1] + avgs[2]) / 3 + diff
  log('%' + quality)
  return quality
}
