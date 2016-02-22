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

function averageTable (table, index) {
  var arr = []
  var total = 0

  log('Quantization table', index ? '(chrominance)' : '(luminance)')

  for (var i = 0; i < table.length; i += 2) {
    arr.push(table[i] + table[i + 1])
  }

  arr.unshift()

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

function searchQuantizationTable (buf) {
  var length = 0
  var arr = []
  var B1
  var B2
  var type
  var i = 2
  while (i < buf.length) {
    if (buf[i] === 0xff) {
      B1 = buf[i]
      i += 1
      while (buf[i] === 255) {
        i += 1
      }
      if (buf[i] === 0) continue
      B2 = buf[i]
      i += 1
      type = B1 * 256 + B2
      length = buf[i] * 256 + buf[i + 1] - 2
      i += 2

      if (type !== 0xffdb) {
        i += length
        continue
      }

      if (length % 65 === 0) {
        var table = buf.slice(i, i + length)
        for (var j = 0; j < length / 65; j += 1) {
          arr.push(table.slice(j * 65, (j + 1) * 65).toString('hex'))
        }
        i += length
      }
    } else {
      i += 1
    }
  }
  return arr
}

module.exports = function jpegquality (buf) {
  // validate jpeg header
  if (buf[0] !== 255 && buf[1] !== 216) throw new Error('Not a supported JPEG format')

  var diff
  var quality

  var tables = searchQuantizationTable(buf)
  var avgs = tables.map((table, index) => averageTable(table, index))

  if (avgs.length > 3) avgs.length = 3

  if (avgs.length === 1) {
    log('only one table result is', avgs[0])
    return avgs[0]
  }

  if (avgs.length === 2) {
    avgs[2] = avgs[1]
    diff = Math.abs(avgs[0] - avgs[1]) * 0.49
    diff += Math.abs(avgs[0] - avgs[2]) * 0.49
    quality = (avgs[0] + avgs[1] + avgs[2]) / 3 + diff
    log('%' + quality)
    return quality
  }

  if (avgs.length === 3) {
    diff = Math.abs(avgs[0] - avgs[1]) * 0.49
    diff += Math.abs(avgs[0] - avgs[2]) * 0.49
    quality = (avgs[0] + avgs[1] + avgs[2]) / 3 + diff
    log('%' + quality)
    return quality
  }
}
