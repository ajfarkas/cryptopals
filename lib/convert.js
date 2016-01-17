// # Basic Conversion
var Const = require('./const')

var C = {}
/* ## To Binary Conversions
* All `input`s must be valid strings and limited to the character set of the appropriate encoding.
* Outputs will be strings composed of `1`s and `0`s. 
*/

// `C.hexToBin('f')` returns '1111'
C.hexToBin = function(input) {
  if ( typeof input != 'string' || input.match(/[^a-fA-F0-9]/) )
    return console.error('invalid arg on hextToBin: hexadecimal strings only')
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
// `C.base64ToBin('/')` returns '111111'
C.base64ToBin = function(input) {
  if ( typeof input != 'string' || input.match(/[^0-9a-zA-Z+/=]/) )
    return console.error('invalid arg on base64ToBin: base64 strings only')
  var padding = input.match('=') ? input.match(/\=/g).length : 0,
      b64 = input.replace(/\=/g, '').split(''),
      zero = '000000'
  //map each b64 digit to a six-digit binary number
  var bin = b64.map(function(num) {
    var digits = Const.base64.indexOf(num).toString(2)
    //add any necessary leading zeroes
    return zero.slice(digits.length) + digits
  })
  var result = bin.join('')
  //output string
  return result.slice(0, result.length - (2 * padding) )
}
// `C.asciiToBin('!')` returns '00100001'
C.asciiToBin = function(input) {
  if ( typeof input != 'string' )
    return console.error('invalid arg on asciiToBin: ascii strings only')
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
* All `input`s must be strings in binary format (`1`s and `0`s only).
* Outputs will be strings in the format of the appropriate encoding. 
*/

// `C.binToHex('1111')` returns 'f'
C.binToHex = function (input) {
  if ( typeof input != 'string' || input.match(/[^01]/) )
    return console.error('invalid arg on binToHex: binary strings only ')
  //check if trailing zeroes are necessary
  var post = input.length % 4,
      zero = '0000'
  input = post > 0 ? input + zero.slice(post) : input
  //create array of 4-digit binary sets
  var sets = input.match(/\d{4}/g)
  //map each binary set to a hex digit
  var result = sets.map(function(num) {
    return Const.base16[parseInt(num, 2)]
  })
  //return as string
  return result.join('')
}
// `C.binToBase64('111000')` returns '4'
// `C.binToBase64('1110')` returns '4='
C.binToBase64 = function(input) {
  if ( typeof input != 'string' || input.match(/[^01]/) )
    return console.error('invalid arg on binToBase64: binary strings only ')
  //check if trailing zeroes are necessary
  var post = input.length % 6,
      zero = '000000'
  var padding = ''

  if (post == 4)
    padding = '='
  else if (post == 2)
    padding = '=='
  input = post > 0 ? input + zero.slice(post) : input
  //create array of 6-digit binary sets
  var sets = input.match(/\d{6}/g)
  //map each binary set to a base-64 digit
  var result = sets.map(function(num) {
    return Const.base64[parseInt(num, 2)]
  })
  //return as string
  return result.join('')+padding
}
// `C.binToAscii('00100100')` returns '$''
C.binToAscii = function(input) {
  if ( typeof input != 'string' || input.match(/[^01]/) )
    return console.error('invalid arg on binToAscii: binary strings only ')
  //check if trailing zeroes are necessary
  var post = input.length % 8,
      zero = '00000000'

  input = post > 0 ?  input + zero.slice(post) : input

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
C.hexToBase64 = function(input) {
  if ( typeof input != 'string' || input.match(/[^a-fA-F0-9]/) )
    return console.error('invalid arg on hextToBase64: hexadecimal strings only')
  return C.binToBase64( C.hexToBin(input) )
}
C.hexToAscii = function(input) {
  if ( typeof input != 'string' || input.match(/[^a-fA-F0-9]/) )
    return console.error('invalid arg on hextToAscii: hexadecimal strings only')
  return C.binToAscii( C.hexToBin(input) )
}
C.base64ToHex = function(input) {
  if ( typeof input != 'string' || input.match(/[^0-9a-zA-Z+/=]/) )
    return console.error('invalid arg on base64ToHex: base64 strings only')
  return C.binToHex( C.base64ToBin(input) )
}
C.base64ToAscii = function(input) {
  if ( typeof input != 'string' || input.match(/[^0-9a-zA-Z+/=]/) )
    return console.error('invalid arg on base64ToAscii: base64 strings only')
  return C.binToAscii( C.base64ToBin(input) )
}
C.asciiToHex = function(input) {
  if ( typeof input != 'string' )
    return console.error('invalid arg on asciiToHex: ascii strings only')
  return C.binToHex( C.asciiToBin(input) )
}
C.asciiToBase64 = function(input) {
  if ( typeof input != 'string' )
    return console.error('invalid arg on asciiToBase64: ascii strings only')
  return C.binToBase64( C.asciiToBin(input) )
}
/* ## Strip "Smart" characters
 * Input is probably ascii, if you're stripping smart quotes.
 * Output will be string.
*/
C.smartToPlain = function(input) {
  var smarts = [
    { smart: "\\u2018\|\\u2019\|\\u201A\|\\uFFFD", dumb: "'" },
    { smart: "\\u201c\|\\u201d\|\\u201e", dumb: '"' },
    { smart: "\\u02C6", dumb: "^" },
    { smart: "\\u2039", dumb: "<" },
    { smart: "\\u203A", dumb: ">" },
    { smart: "\\u2013", dumb: "-" },
    { smart: "\\u2014", dumb: "--" },
    { smart: "\\u2026", dumb: "..." },
    { smart: "\\u00A9", dumb: "(c)" },
    { smart: "\\u00AE", dumb: "(r)" },
    { smart: "\\u2122", dumb: "TM" },
    { smart: "\\u00BC", dumb: "1/4" },
    { smart: "\\u00BD", dumb: "1/2" },
    { smart: "\\u00BE", dumb: "3/4" },
    { smart: "\\u00A0", dumb: " " },
    { smart: "\\u02DC", dumb: "~" }
  ]
  smarts.forEach(function(s) {
    var reg = new RegExp(s.smart, 'g')
    input = input.replace(reg, s.dumb)
  })
  return input
}
C.smartUnicodeToPlain = function(input) {
  var smarts = [
    { smart: "‘\|’\|‚\|�", dumb: "'" },
    { smart: "“\|”\|„", dumb: '"' },
    { smart: "ˆ", dumb: "^" },
    { smart: "‹", dumb: "<" },
    { smart: "›", dumb: ">" },
    { smart: "–", dumb: "-" },
    { smart: "—", dumb: "--" },
    { smart: "…", dumb: "..." },
    { smart: "©", dumb: "(c)" },
    { smart: "®", dumb: "(r)" },
    { smart: "™", dumb: "TM" },
    { smart: "¼", dumb: "1/4" },
    { smart: "½", dumb: "1/2" },
    { smart: "¾", dumb: "3/4" },
    { smart: " ", dumb: " " },
    { smart: "˜", dumb: "~" }
  ]
  smarts.forEach(function(s) {
    var reg = new RegExp(s.smart, 'g')
    input = input.replace(reg, s.dumb)
  })
  return input
}

module.exports = C