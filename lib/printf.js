module.exports = function printf (format, d) {
  // 先判斷 d 是幾位數
  var numberLength = d.toString().length
  var desireWidth = format.slice(1, 2)
  var padding = parseInt(desireWidth, 10) - numberLength
  for (var i = 0; i < padding; i += 1) {
    if (process.env.DEBUG) {
      process.stdout.write(' ')
    }
  }
  if (process.env.DEBUG) {
    process.stdout.write(d.toString())
  }
}
