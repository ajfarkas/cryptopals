var fs = require('fs')
var Const = require('./const')
var Detect = require('./detect')
var Score = require('./score')
var Convert = require('./convert')
var XOR = require('./xor')
var Encrypt = require('./encrypt')

var C = {
  const: Const,
  detect: Detect,
  score: Score,
  convert: Convert,
  xor: XOR,
  encrypt: Encrypt
}
module.exports = C