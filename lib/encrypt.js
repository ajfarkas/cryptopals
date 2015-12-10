// # Encryption Functions
var Detect = require('./detect')
var Convert = require('./convert')
var XOR = require('./xor')

var E = {}

/* ## Repeating Key Encryption
* `input` and `key` args must be strings. If they are not already in binary format, they will be converted from ascii to binary.
* Optional `opts` arg is an object, with the following possible keys:
* - `enc` declares the encoding of the input.
* - `encOut` determines the encoding of the output.
*   - 'hex' (default)
*   - 'base64'
*   - 'ascii'
* 
* Output is your encrypted `string`.
*/
E.repeatKey = function(input, key, opts) {
  if (typeof input != 'string')
    return console.error('invalid arg on Encrypt.repeatKey: input must be a string')
  if (typeof key != 'string')
    return console.error('invalid arg on Encrypt.repeatKey: key must be a string')
  var enc = (opts && opts.enc) ? opts.enc : Detect.encoding(input.slice(0, 200))
  //insure input is a binary string
  if (enc != 'bin')
    input = Convert[enc+'ToBin'](input)
  //insure key is a binary string
  if (Detect.encoding(key) != 'bin')
    key = Convert.asciiToBin(key)

  var msg = XOR.combine(input, key)

  if (!opts || opts.encOut == 'hex')
    return Convert.binToHex(msg)
  if (opts && opts.encOut == 'base64')
    return Convert.binToBase64(msg)
  else if (opts && opts.encOut == 'ascii')
    return Convert.binToAscii(msg)
  else
    return msg
}

module.exports = E