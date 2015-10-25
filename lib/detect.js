// # Detection Functions
var D = {}

/* ## Detect Encoding
* Find the encoding type of a given string. `input` must be a `string`.
* Output will be a `string` with the encoding label (from `Const.enc`)
* Current support:
* - binary
* - hexadecimal
* - base64
* - ascii
*/
D.encoding = function(input) {
  if (typeof input != 'string')
    return console.error('invalid input on Detect.encoding: input must be a string')
  
  if (!input.match(/[^01]/))
    return 'binary'
  else if (!input.match(/[^0-9a-fA-F]/) && !input.match(/[a-f][A-F]/))
    return 'hex'
  else if (!input.match(/[^A-Za-z0-9+/]/))
    return 'base64'
  else if (!input.match(/[^\x00-\xff]/))
    return 'ascii'
  else return null
}

module.exports = D