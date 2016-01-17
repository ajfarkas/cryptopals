// # Xor Functions
var Convert = require('./convert')
var Score = require('./score')

var X = {}

/* ## XOR Combine
* Args `a` and `b` must both be `strings` in binary format. Args may be unequal lengths.
* Output will be a `string` in binary format.
* `XOR.combine('101', '100')` returns '001'
*/
X.combine = function(a, b) {
  var err
  [a, b].forEach(function(input) {
    if ( typeof input != 'string' || input.match(/[^01]/) )
      err = console.error('invalid arg on XOR.combine: binary strings only')
  })
  if (err) return err;

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
* `opts` arg is optional:
* - `enc` can be defined to change key encoding to test for (default is ascii)
*   - 'hex' (hexadecimal)
*   - 'b64' (base64)
* - `score` can be defined to change message scoring method (default is frequency)
*   - 'freq' (common letter frequency)
*   - 'digraph' (common letter pairs)
* - `noUnicode` (bool) can be set to give negative weight to unicode characters while scoring
* - `return` can be defined to reduce output (default is object)
*   - `score` (only the best score)
*   - `key` (only the key)
*   - `msg` (only the decrypted message)

* Output is an object containing the key, decrypted message, and the decryption score for the best key
*
* var bin = '011001010110000101110100'
*
* `XOR.findSingleFrom(bin, {enc: 'ascii', score: 'freq'})` returns { score: 72, key: '00000100', msg: 'eat' }
*/
X.findSingle = function(input, opts) {
  if (typeof input != 'string')
    return console.error('inalid arg on XOR.find: input must be a binary string')
  var keyBin, key, xorResult, newScore, best

  var check = function(zero) {
    keyBin = i.toString(2)
    key = zero.slice(keyBin.length) + keyBin

    xorResult = Convert.binToAscii( X.combine(input, key) )
    if (opts && opts.score == 'digraph')
      newScore = Score.digraph(xorResult)
    else 
      newScore = Score.frequency(xorResult, { noUnicode: opts ? opts.noUnicode : false })
    if (!best || best.score < newScore) {
      best = {
        score: newScore,
        key: key,
        msg: xorResult
      }
    }
  }
  // test for hex keys
  if (opts && opts.enc == 'hex') {
    for (var i = 0; i < 16; i++) {
      check('0000')
    }
  }
  // test for base64 keys
  if (opts && opts.enc == 'b64') {
    for (var i = 0; i < 64; i++) {
      check('000000')
    }
  }
  // test for ascii keys
  else {
    for (var i = 32; i < 129; i++) {
      check('00000000')
    }
  }
  // console.log(best)
  if (opts && opts.return)
    return best[opts.return]
  else
    return best
}

module.exports = X

