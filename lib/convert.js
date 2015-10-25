// # Basic Conversion
var fs = require('fs')

var C = {}
C.base16 = '0123456789abcdef'
C.base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
C.asciiPrint = [32, 126]
/* ## To Binary Conversions
* All inputs must be valid strings and limited to the character set of the appropriate encoding.
* Outputs will be strings composed of `1`s and `0`s. 
*/
C.hexToBin = function(input) {
  if ( typeof input != 'string' || input.match(/[^a-fA-F0-9]/) )
    return console.error('invalid input on hextToBin: hexadecimal strings only')
  var hex = input.split(''),
    zero = '0000'
  //map each hex digit to a four-digit binary number
  var bin = hex.map(function(num) {
    var digits = parseInt(num, 16).toString(2)
    //add any necessary leading zeroes
    return zero.slice(digits.length) + digits
  })
  //output string
  return bin.join('')
}
C.base64ToBin = function(input) {
  if ( typeof input != 'string' || input.match(/[^0-9a-zA-Z+/]/) )
    return console.error('invalid input on base64ToBin: base64 strings only')
  var b64 = input.split(''),
      zero = '000000'
  //map each b64 digit to a six-digit binary number
  var bin = b64.map(function(num) {
    var digits = C.base64.indexOf(num).toString(2)
    //add any necessary leading zeroes
    return zero.slice(digits.length) + digits
  })
  //output string
  return bin.join('')
}
C.asciiToBin = function(input) {
  if ( typeof input != 'string' )
    return console.error('invalid input on asciiToBin: ascii strings only')
  var text = input.split(''),
      zero = '00000000'
  //map each ascii char to a eight-digit binary number
  results = text.map(function(c) {
    var digits = c.charCodeAt().toString(2)
    return zero.slice(digits.length) + digits
  })

  return results.join('')
}
/* ## From Binary Conversions
* All inputs must be strings in binary format (`1`s and `0`s only).
* Outputs will be strings in the format of the appropriate encoding. 
*/
C.binToHex = function (input) {
  if ( typeof input != 'string' || input.match(/[^01]/) )
    return console.error('invalid input on binToHex: binary strings only ')
  //check if leading zeroes are necessary
  var pre = input.length % 4,
      zero = '0000'
  input = pre > 0 ? zero.slice(pre) + input : input
  //create array of 4-digit binary sets
  var sets = input.match(/\d{4}/g)
  //map each binary set to a hex digit
  var result = sets.map(function(num) {
    return C.base16[parseInt(num, 2)]
  })
  //return as string
  return result.join('')
}
C.binTo64 = function(input) {
  if ( typeof input != 'string' || input.match(/[^01]/) )
    return console.error('invalid input on binTo64: binary strings only ')
  //check if leading zeroes are necessary
  var pre = input.length % 6,
      zero = '000000'

  input = pre > 0 ? zero.slice(pre) + input : input
  //create array of 6-digit binary sets
  var sets = input.match(/\d{6}/g)
  //map each binary set to a base-64 digit
  var result = sets.map(function(num) {
    return C.base64[parseInt(num, 2)]
  })
  //return as string
  return result.join('')
}
C.binToAscii = function(input) {
  if ( typeof input != 'string' || input.match(/[^01]/) )
    return console.error('invalid input on binToAscii: binary strings only ')
  //check if leading zeroes are necessary
  var pre = input.length % 8,
      zero = '00000000'

  input = pre > 0 ? zero.slice(pre) + input : input

  var sets = input.match(/\d{8}/g)

  var result = sets.map(function(set) {
    return String.fromCharCode( parseInt(set, 2) )
  })

  return result.join('')
}
/* ## Other Encoding Conversions
* All inputs must be strings and limited to the appropriate character set.
* Outputs will be strings.
*/
C.hexTo64 = function(input) {
  if ( typeof input != 'string' || input.match(/[^a-fA-F0-9]/) )
    return console.error('invalid input on hextTo64: hexadecimal strings only')
  return C.binTo64( C.hexToBin(input) )
}
C.hexToAscii = function(input) {
  if ( typeof input != 'string' || input.match(/[^a-fA-F0-9]/) )
    return console.error('invalid input on hextToAscii: hexadecimal strings only')
  return C.binToAscii( C.hexToBin(input) )
}
C.base64ToHex = function(input) {
  if ( typeof input != 'string' || input.match(/[^0-9a-zA-Z+/]/) )
    return console.error('invalid input on base64ToHex: base64 strings only')
  return C.binToHex( C.base64ToBin(input) )
}
C.base64ToAscii = function(input) {
  if ( typeof input != 'string' || input.match(/[^0-9a-zA-Z+/]/) )
    return console.error('invalid input on base64ToAscii: base64 strings only')
  return C.binToAscii( C.base64ToBin(input) )
}
C.asciiToHex = function(input) {
  if ( typeof input != 'string' )
    return console.error('invalid input on asciiToHex: ascii strings only')
  return C.binToHex( C.asciiToBin(input) )
}
C.asciiTo64 = function(input) {
  if ( typeof input != 'string' )
    return console.error('invalid input on asciiTo64: ascii strings only')
  return C.binTo64( C.asciiToBin(input) )
}

module.exports = C