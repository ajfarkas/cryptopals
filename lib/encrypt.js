// # Encryption Functions
var Detect = require('./detect')
var Convert = require('./convert')
var XOR = require('./xor')

var E = {}

/* ## Repeating Key Encryption
* `input` and `key` args must be strings. If they are not already in binary format, they will be converted from ascii to binary.
* Optional `opts` arg is an object, with the following possible keys:
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
  //insure input and key are binary strings
  if (Detect.encoding(input) != 'bin')
    input = Convert.asciiToBin(input)
  if (Detect.encoding(key) != 'bin')
    key = Convert.asciiToBin(key)

  var msg = XOR.combine(input, key)

  if (!opts || opts.encOut == 'hex')
    return Convert.binToHex(msg)
  if (opts && opts.encOut == 'base64')
    return Convert.binTo64(msg)
  else if (opts && opts.encOut == 'ascii')
    return Convert.binToAscii(msg)
  else
    return msg
}

module.exports = E