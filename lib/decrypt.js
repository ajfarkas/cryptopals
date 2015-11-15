// # Decryption Functions
var Const = require('./const')
var Detect = require('./detect')
var Convert = require('./convert')
var XOR = require('./xor')

var D = {}

/* ## Get Hamming Distance
 * Calculates the number of differing bits between two strings.
 *
 * Arguments `a` & `b` must be strings. 
 * Optional argument `enc` specifies encoding. Encoding is automatically detected by default.
*/
D.getHamming = function(a, b, enc) {
  if (typeof a != 'string' || typeof b != 'string')
    return console.error('invalid arg on Decrypt.getHamming: inputs must be strings')
  if (enc && Const.enc.indexOf(enc) == -1)
    return console.error('invalid arg on Decrypt.getHamming: invalid encoding type')
  var encA = enc || Detect.encoding(a)
  var encB = enc || Detect.encoding(b)
  var binA = encA == 'bin' ? a.split('') : Convert[encA+'ToBin'](a).split('')
  var binB = encB == 'bin' ? b.split('') : Convert[encB+'ToBin'](b).split('')

  var len = Math.min(binA.length, binB.length)
  var distance = 0

  binA.slice(0, len).forEach(function(bitA, i) {
    if (bitA !== binB[i])
      distance++
  })
  return distance
}

/* ## Get Key Size
 * `Decrypt.getKeySize('1000110101101001001', 4, [2, 20], 2);`
 * 
 * compare Hamming distance of blocks of bytes to determine probable key size
 * - `input` (required) is the encyrpted code, converted to binary.
 * - `byte` (required) is the size of a byte (in the above example, 4 for hexadecimal).
 * - `range` (required) is an array of the min and max key size to check for (2 to 20 in the above example).
 * - `number` (optional) is the number of key sizes to return.
 * By default, returns an integer representing the likliest key size. If `number` arg is passed, returns an array of likely key sizes.
*/
D.getKeySize = function(input, byte, range, number) {
  if (typeof input != 'string')
    return console.error('invalid arg on Decrypt.getKeySize: input must be a string')
  if (typeof byte != 'number')
    return console.error('invalid arg on Decrypt.getKeySize: bite must be an int')
  if (typeof range != 'object' || range.length != 2)
    return console.error('invalid arg on Decrypt.getKeySize: range must be an array of length 2')
  if (input.length < byte * range[1] * 4)
    return console.error('arg error on Decrupt.getKeySize: input is too short for requested key size')
  if (number && typeof number != 'number')
    return console.error('invalid arg on Decrypt.getKeySize: input must be an int')
  //get average hamming distance of two sets of blocks, make array of distance for each key length
  var results = []
  var len = range[1] + 1
  for (var size = range[0]; size < len; size++) {
    var regex = new RegExp('.{'+(size * byte)+'}', 'g')
    var blocks = input.match(regex)
    var hamming = ( D.getHamming(blocks[0], blocks[1]) + D.getHamming(blocks[2], blocks[3]) ) / 2
    results.push([size, hamming / size])
  }
  //sort by Hamming distance
  results.sort(function(a, b) { return a[1] - b[1] })
  //return single best key size or array of best sizes (smallest Hamming)
  if (number) {
    return results.slice(0, number).map(function(r) { return r[0] })
  } else {
    return results[0][0]
  }
}

/* ## Repeating Key Decryption
 * `input` args must be a string.
 *
 * Optional `opts` arg is an object:
 * - `enc` declares the suspected encoding of the key.
 *   - 'bin'
 *   - 'hex'
 *   - 'base64'
 *   - 'ascii'
 * 
 * Output is your decrypted `string`.
*/
D.repeatKey = function(input, opts) {
  if (typeof input != 'string')
    return console.error('invalid arg on Decrypt.repeatKey: input must be a string')
  if (opts && typeof opts != 'object')
    return console.error('invalid arg on Decrypt.repeatKey: opts must be an object')
  var enc = (opts && opts.enc) ? opts.enc : Detect.encoding(input.slice(0, 100))
  //insure input is a binary string
  if (enc != 'bin')
    input = Convert[enc+'ToBin'](input)
  var byteLen = (opts && opts.enc) ? (Const.enc.indexof(opts.enc)+1) * 2 : 8
  var keyRange = [2, 40]
  var keyTries = 2

  D.getKeySize(input.slice(0, byteLen * 4 * keyRange[1]), byteLen, keyRange, keyTries)
}

module.exports = D