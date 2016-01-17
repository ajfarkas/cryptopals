// # Crypto
// Exposes high-level functions
var fs = require('fs')
var Const = require('./lib/const')
var Detect = require('./lib/detect')
var Score = require('./lib/score')
var Convert = require('./lib/convert')
var XOR = require('./lib/xor')
var Encrypt = require('./lib/encrypt')
var Decrypt = require('./lib/decrypt')

var Run = {}
var func = process.argv[2]

if (process.argv.length < 4)
  return console.error('Not enough inputs. Must include at least a function and an input.')

// ## Repeating Key Encryption
// `$ node crypto repeatKey -in path/to/file -key password1234`
/* Flags are used to input args: include arg immediately after the flag.
* - `-in`: path to file to encrypt, or text to encrypt (use `--inline` for latter).
* - `-key`: `string` key to encrypt input.
* - `-out`: [optional] path to output file.
* - `--inline`: [optional] encrypt input arg as `string` (reads `-in` as path to file by default).
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

  var encrypt = function(data) {
    var encrypted = Encrypt.repeatKey(data, key, opts)
    if (output) {
      fs.writeFile(output, encrypted, function(err) {
        if (err) console.error('Write err! '+err)
        console.log('Successfully encrypted to '+output)
      })
    } else {
      console.log(encrypted)
    }
  }

  if (stdIn) {
    encrypt(input)
  } else {
    fs.readFile(input, 'utf8', function(err, data) {
      if (err) 
        return console.error(err)
      encrypt( Convert.smartToPlain(data) )
    })
  }
}
// ## Repeating Key Decryption
// `$ node crypto decryptXOR -in path/to/file -out path/to/output.txt`
/* Flags are used to input args: include arg immediately after the flag.
* - `-in`: path to file to decrypt, or text to decrypt (use `--inline` for latter).
* - `-out`: [optional] path to output file.
* - `--inline`: [optional] decrypt input arg as `string` (reads `-in` as path to file by default).
* - `-opts`: [optional] `object` containing encoding options.
*   - `encOut` determines the encoding of the output.
*     - 'hex' 
*     - 'base64'
*     - 'ascii' (default)
*/
Run.decryptXOR = function() {
  var input, output, opts
  var inputI = process.argv.indexOf('-in')
  var outputI = process.argv.indexOf('-out')
  var optsI = process.argv.indexOf('-opts')
  var stdIn = process.argv.indexOf ('--inline') > -1

  if (inputI > -1)
    input = process.argv[inputI + 1]
  else 
    return console.error('Error: Include "-in" value')
  
  if (outputI > -1)
    output = process.argv[outputI + 1] 
  if (optsI > -1)
    opts = JSON.parse(process.argv[optsI + 1])

  var decrypt = function(data) {
    var key = Decrypt.getRepeatKey(data, opts)
    console.log(key)
    if (output) {
      fs.writeFile(output, Encrypt.repeatKey(data, key[0], opts), function(err) {
        if (err) return console.error('Write err! '+err)
        console.log('Successfully decrypted to '+output)
      })
    } 
  }

  if (stdIn) {
    decrypt(input)
  } else {
    fs.readFile(input, 'utf8', function(err, data) {
      if (err) 
        return console.error(err)
      decrypt(data)
    })
  }
}

//Do the things
Run[func]()
