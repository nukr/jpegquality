/* global describe, it */
var fs = require('fs')
var path = require('path')
var expect = require('chai').expect
var jpegquality = require('../lib/jpegquality')

describe('jpegquality', function () {
  it('25% quality', function (done) {
    fs.readFile(path.join(__dirname, './estq-25.jpg'), function (err, data) {
      if (err) return console.error(err)
      var buf = new Buffer(data)
      var result = jpegquality(buf)
      expect(Math.round(result)).to.be.equal(1)
      done()
    })
  })

  it('70% quality', function (done) {
    fs.readFile(path.join(__dirname, './estq-70.jpg'), function (err, data) {
      if (err) return console.error(err)
      var buf = new Buffer(data)
      var result = jpegquality(buf)
      expect(Math.round(result, 10)).to.be.equal(70)
      done()
    })
  })

  it('92% quality', function (done) {
    fs.readFile(path.join(__dirname, './estq-92.jpg'), function (err, data) {
      if (err) return console.error(err)
      var buf = new Buffer(data)
      var result = jpegquality(buf)
      expect(Math.round(result, 10)).to.be.equal(92)
      done()
    })
  })

  it('200%', function (done) {
    fs.readFile(path.join(__dirname, './200%.jpg'), function (err, data) {
      if (err) return console.error(err)
      var buf = new Buffer(data)
      var result = jpegquality(buf)
      expect(Math.round(result)).to.be.equal(98)
      done()
    })
  })

  it('4 table 99%', function (done) {
    fs.readFile(path.join(__dirname, './4-table-99%.jpg'), function (err, data) {
      if (err) return console.error(err)
      var buf = new Buffer(data)
      var result = jpegquality(buf)
      expect(Math.round(result)).to.be.equal(99)
      done()
    })
  })

  it('one table 99%', function (done) {
    fs.readFile(path.join(__dirname, './one-table-99.jpg'), function (err, data) {
      if (err) return console.error(err)
      var buf = new Buffer(data)
      var result = jpegquality(buf)
      expect(Math.round(result)).to.be.equal(99)
      done()
    })
  })
})
