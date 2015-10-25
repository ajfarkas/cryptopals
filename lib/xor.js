// # Xor Functions
var Const = require('./const')
var Convert = require('./convert')
var Score = require('./score')

var X = {}

/* ## XOR Combine
* Inputs `a` and `b` must both be `strings` in binary format. Inputs may be unequal lengths.
* Output will be a `string` in binary format.
* `XOR.combine('101', '100')` returns '001'
*/
X.combine = function(a, b) {
  [a, b].forEach(function(input) {
    if ( typeof input != 'string' || input.match(/[^01]/) )
      return console.error('invalid input on XOR.combine: binary strings only')
  })
  var lenA = a.length,
      lenB = b.length
  var longest = Math.max(lenA, lenB)
  var result = ''

  for (var i = 0; i < longest; i++) {
    result += a[i % lenA] === b[i % lenB] ? 0 : 1 
  }

  return result
}
/* ## Find Single-Character XOR Key
* `input` must be a `string` in binary format
* Output is an object containing the key, decrypted message, and the decryption score for the best key
*
* var bin = '011001010110000101110100'
*
* `XOR.findSingleFrom(bin)` returns { score: 72, key: '00000100', msg: 'eat' }
*/
X.findSingle = function(input) {
  if (typeof input != 'string')
    return console.error('inalid input on XOR.find: input must be a binary string')
  var keyBin, key, xorResult, newScore, best

  var check = function(zero) {
    keyBin = i.toString(2)
    key = zero.slice(keyBin.length) + keyBin

    xorResult = Convert.binToAscii( X.combine(input, key) )
    newScore = Score.frequency(xorResult)
    if (!best || best.score < newScore) {
      best = {
        score: newScore,
        key: key,
        msg: xorResult
      }
    }
  }
  //test for hex keys
  for (var i = 0; i < 16; i++) {
    check('0000')
  }
  //test for base64 keys
  for (var i = 0; i < 64; i++) {
    check('000000')
  }
  //test for ascii keys
  for (var i = 0; i < 256; i++) {
    check('00000000')
  }
  return best
}

module.exports = X

