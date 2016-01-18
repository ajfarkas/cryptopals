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
    return console.error('invalid arg on Decrypt.getHamming: inputs must be strings\n'+a+','+b)
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
 * `Decrypt.getKeySize('1000110101101001001', [2, 20], 2);`
 * 
 * compare Hamming distance of blocks of bytes to determine probable key size
 * - `input` (required) is the encyrpted code, converted to binary.
 * - `range` (required) is an array of the min and max key size to check for (2 to 20 in the above example).
 * - `number` (optional) is the number of key sizes to return.
 * - `opts` (optional) is an object with the following possible keys:
 *   - `keyEnc` (`string`): the encoding of the key. 
 *   - `score` (`bool`): include the hamming distance in the output.
 * By default, returns an integer representing the likliest key size. If `number` arg is passed, returns an array of likely key sizes.
*/
D.getKeySize = function(input, range, number, opts) {
  if (typeof input != 'string')
    return console.error('invalid arg on Decrypt.getKeySize: input must be a string')
  if (typeof range != 'object' || range.length != 2)
    return console.error('invalid arg on Decrypt.getKeySize: range must be an array of length 2')
  if (number && typeof number != 'number')
    return console.error('invalid arg on Decrypt.getKeySize: number must be an int')
  if (opts && typeof opts != 'object')
    return console.error('invalid arg on Decrypt.getKeySize: opts must be an object')
  //get average hamming distance of two sets of blocks, make array of distance for each key length
  var results = []
  var len = range[1]
  var bits = (opts && opts.keyEnc) ? Const.enc.indexOf(opts) * 2 : 8
  var enc = Detect.encoding(input)
  if (enc != 'bin')
    input = Convert[enc+'ToBin'](input)
  if (input.length < range[1] * 8 * 8)
    return console.error('arg error on Decrypt.getKeySize: input is too short for requested key size')
  for (var size = range[0]; size <= len; size++) {
    var regex = new RegExp('.{'+size * bits+'}', 'g')
    var blocks = input.match(regex)
    var hams = 0
    for (var i = 0; i < 8; i += 2) {
      hams += D.getHamming( blocks[i], blocks[i+1] )
    }
    var hamming = hams / 4
    results.push([size, hamming / size])
  }
  //sort by Hamming distance
  results.sort(function(a, b) { return a[1] - b[1] })
  //return single best key size or array of best sizes (smallest Hamming)
  if (number) {
    if (opts && opts.score)
      return results.slice(0, number).map(function(r) { return r })
    else
      return results.slice(0, number).map(function(r) { return r[0] })
  } else {
    if (opts && opts.score)
      return results[0]
    else
      return results[0][0]
  }
}

/* ## Transpose byte blocks
 * `Decrypt.transpose("10010101000101001001", 3, 4)`
 * 
 * - `input` arg must be a string.
 * - `size` arg (`int`) is the key length (ie, 3 characters)
 * - `byteLen` arg (`int`) is the number of bits per byte (ie, 4 bits for hex)
 *
 * Output is an `array` of `string`s.
*/
D.transpose = function(input, size, byteLen) {
  var blocksRegex = new RegExp('.{'+size * byteLen+'}', 'g')
    var byteRegex = new RegExp('.{'+byteLen+'}', 'g')
    var blocks = input.match(blocksRegex)
    var transBlocks = []
    for (var i = 0; i < size; i++) {
      transBlocks[i] = ''
    }
    //transpose into blocks of nth byte [nnn,n'n'n', n''n''n'', etc.]
    blocks.forEach(function(block) {
      var bytes = block.match(byteRegex)
      bytes.forEach(function(byte, i) {
        transBlocks[i % size] += byte
      })
    })
  return transBlocks    
}

/* ## Repeating Key Decryption
 * `Decrypt.getRepeatKey("10010101000101001001", '{"keyrange": [8, 16], "keytries": 2}')`
 *
 * `input` arg must be a string.
 *
 * Optional `opts` arg is an object:
 * - `enc` declares the suspected encoding of the key.
 *   - 'bin'
 *   - 'hex'
 *   - 'base64'
 *   - 'ascii' (default)
 * - `keyrange` sets a keysize range to check. This must be an array of length 2. Default is [2, 40].
 * - `keytries` sets the number of keysizes to check. This must be an `int`. Default is 2.
 * 
 * Output is an `array` of [keytries] key `string`(s): `["password", "PasSword1234"]`
*/
D.getRepeatKey = function(input, opts) {
  if (typeof input != 'string')
    return console.error('invalid arg on Decrypt.repeatKey: input must be a string')
  if (opts && typeof opts != 'object')
    return console.error('invalid arg on Decrypt.repeatKey: opts must be an object')
  var enc = (opts && opts.enc) ? opts.enc : Detect.encoding(input.slice(0, 100))
  //strip smart characters
  if (enc == 'ascii')
    input = Convert.smartToPlain(input)
  //insure input is a binary string
  if (enc != 'bin')
    input = Convert[enc+'ToBin'](input)
  var byteLen = (opts && opts.enc) ? (Const.enc.indexof(opts.enc)+1) * 2 : 8
  var keyRange = (opts && opts.keyrange) ? opts.keyrange : [2, 40]
  var keyTries = (opts && opts.keytries) ? opts.keytries : 4

  var sizes = D.getKeySize(input.slice(0, byteLen * keyRange[1] * 500), keyRange, keyTries)
  if (typeof sizes == 'number')
    sizes = [sizes]
  var keyResults = []

  sizes.forEach(function(size) {
    transBlocks = D.transpose(input, size, byteLen)
    var key = ''
    transBlocks.forEach(function(tBlock) {
      key += XOR.findSingle(tBlock, { return: 'key', noUnicode: true })
    })
    keyResults.push(Convert.binToAscii(key))
  })

  return keyResults
}

module.exports = D