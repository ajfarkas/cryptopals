// # Crypto
// Exposes high-level functions
var fs = require('fs')
var Const = require('./lib/const')
var Detect = require('./lib/detect')
var Score = require('./lib/score')
var Convert = require('./lib/convert')
var XOR = require('./lib/xor')
var Encrypt = require('./lib/encrypt')

var Run = {}
var func = process.argv[2]

if (process.argv.length < 4)
  return console.error('Not enough inputs. Must include at least a function and an input.')

// ## Repeating Key Encryption
// `$ node crypto repeatKey -in path/to/file -key password1234`
/* Flags are used to input args: include arg immediately after the flag.
* - `-in`: path to file to encode, or text to encode (use `--inline` for latter).
* - `-key`: `string` key to encrypt input.
* - `-out`: [optional] path to output file.
* - `--inline`: [optional] encode input arg as `string` (reads `-in` as path to file by default).
* - `-opts`: [optional] `object` containing encoding options.
*   - `encOut` determines the encoding of the output.
*     - 'hex' (default)
*     - 'base64'
*     - 'ascii'
*/
Run.repeatKey = function() {
  var input, key, output, opts
  var inputI = process.argv.indexOf('-in')
  var keyI = process.argv.indexOf('-key')
  var outputI = process.argv.indexOf('-out')
  var optsI = process.argv.indexOf('-opts')
  var stdIn = process.argv.indexOf ('--inline') > -1

  if (inputI > -1)
    input = process.argv[inputI + 1]
  else 
    return console.error('Error: Include "-in" value')
  
  if (keyI > -1)
    key = process.argv[keyI + 1]
  else 
    return console.error('Error: Include "-key" value')
  
  if (outputI > -1)
    output = process.argv[outputI + 1] 
  if (optsI > -1)
    opts = JSON.parse(process.argv[optsI + 1])

  var encode = function(data) {
    var encoded = Encrypt.repeatKey(data, key, opts)
    if (output) {
      fs.writeFile(output, encoded, function(err) {
        if (err) console.error('Write err! '+err)
        console.log('Successfully encoded to '+output)
      })
    } else {
      console.log(encoded)
    }
  }

  if (stdIn) {
    encode(input)
  } else {
    fs.readFile(input, 'utf8', function(err, data) {
      if (err) 
        return console.error(err)
      encode(data)
    })
  }
}
//TODO: make this work
Run.decryptXOR = function() {
  var input, key, output, opts
  var inputI = process.argv.indexOf('-in')
  var keyI = process.argv.indexOf('-key')
  var outputI = process.argv.indexOf('-out')
  var optsI = process.argv.indexOf('-opts')
  var stdIn = process.argv.indexOf ('--inline') > -1

  if (inputI > -1)
    input = process.argv[inputI + 1]
  else 
    return console.error('Error: Include "-in" value')
  
  if (keyI > -1)
    key = process.argv[keyI + 1]
  else 
    return console.error('Error: Include "-key" value')
  
  if (outputI > -1)
    output = process.argv[outputI + 1] 
  if (optsI > -1)
    opts = JSON.parse(process.argv[optsI + 1])
}

//Do the things
Run[func]()
