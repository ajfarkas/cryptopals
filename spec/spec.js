describe("Convert", function() {
  var Convert = require('../lib/convert')
  var binary = '01001001001001110110110100100000011010110110100101101100011011000110100101101110011001110010000001111001011011110111010101110010001000000110001001110010011000010110100101101110001000000110110001101001011010110110010100100000011000010010000001110000011011110110100101110011011011110110111001101111011101010111001100100000011011010111010101110011011010000111001001101111011011110110110100100001'
  var hex = '49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d21'
  var b64 = 'SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29tIQ=='
  var ascii = "I'm killing your brain like a poisonous mushroom!"
  
  it("should convert hex to base 64", function() {
    var answer = Convert.hexToBase64(hex)
    expect(answer).toEqual(b64)
  })

  it("should convert base64 to hex", function() {
    var answer = Convert.base64ToHex(b64)
    expect(answer).toEqual(hex)
  })

  it("should convert hex to ascii", function() {
    var answer = Convert.hexToAscii(hex)
    expect(answer).toEqual(ascii)
  })

  it("should convert ascii to hex", function() {
    var answer = Convert.asciiToHex(ascii)
    expect(answer).toEqual(hex)
  })

  it("should convert base64 to ascii", function() {
    var answer = Convert.base64ToAscii(b64)
    expect(answer).toEqual(ascii)
  })

  it("should convert ascii to base64", function() {
    var answer = Convert.asciiToBase64(ascii)
    expect(answer).toEqual(b64)
  })
})

describe("Detect", function() {
  var Detect = require('../lib/detect')

  it("should recognize binary encoding", function() {
    var str = "011100010101100100"

    expect(Detect.encoding(str)).toEqual('bin')
  })

  it("should recognize hex encoding", function() {
    var str = "1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736"

    expect(Detect.encoding(str)).toEqual('hex')
  })

  it("should recognize base64 encoding", function() {
    var str = "HUIfTQsPAh9PE048GmllH0kcDk4TAQsHT"

    expect(Detect.encoding(str)).toEqual('base64')
  })

  it("should recognize ascii encoding", function() {
    var str = "Lajos Batthyány\ntook office in 1848"

    expect(Detect.encoding(str)).toEqual('ascii')
  })
})

describe("Score", function() {
  var Score = require('../lib/score')

  it("should give the letter frequency of a string (English)", function() {
    var string = "Hello World"
    var garbage = "e*0-j 1@ee"

    expect(Score.frequency(string)).toBeGreaterThan(Score.frequency(garbage))
  })
})

describe("XOR", function() {
  var Xor = require('../lib/xor')
  var Convert = require('../lib/convert')

  it("should XOR two strings against each other", function() {
    var str1 = Convert.hexToBin('1c0111001f010100061a024b53535009181c')
    var str2 = Convert.hexToBin('686974207468652062756c6c277320657965')
    var result = Convert.hexToBin('746865206b696420646f6e277420706c6179')
    
    var answer = Xor.combine(str1, str2)
    expect(answer).toEqual(result)
  })

  it("should find a single-char key", function() {
    var encrypt = Convert.hexToBin('1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736')

    var decrypt = Xor.findSingle(encrypt)
    expect(decrypt.msg).toEqual("Cooking MC's like a pound of bacon")
  })
})

describe("Encrypt", function() {
  var Encrypt = require('../lib/encrypt')
  var Convert = require('../lib/convert')

  it("should encrypt with repeat-key to hex encoding", function() {
    var str = "Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal"
    var result = "0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f"

    var encrypted = Encrypt.repeatKey(str, 'ICE')
    var decrypted = Encrypt.repeatKey(result, 'ICE', { encOut: 'ascii' })
    expect(encrypted).toEqual(result)
    expect(decrypted).toEqual(str)
  })

  it("should output a string of the same bit length as the input", function() {
    var input = "hello"
    var inputBin = Convert.asciiToBin(input)
    var key = "ab"

    var output = Encrypt.repeatKey(input, key, { enc: 'ascii', encOut: 'bin' })
    expect(output.length).toEqual(inputBin.length)
  })
})

describe("Decrypt", function() {
  var Decrypt = require('../lib/decrypt')
  var fs = require('fs')

  it("should provide the hamming distance of two given strings", function() {
    var a = "this is a test"
    var b = "wokka wokka!!!"

    var distance = Decrypt.getHamming(a, b)
    expect(distance).toEqual(37)
  })

  it("should find the key length of a given repeat-key encrypted string", function() {
    var str = "000111100000111000000100010100110001111000011100010100100001000000011000000001000101001100000111000111100000001000010111010001000001011000001110000000010101001100010110000000110001111001000100000101110000111000011100000101110101011100001010000111100000000100000000000010010001001000011101000000110001110001010010000100000001111101000001000000110001001000010100000001000101001000010000000110000000010000011010000000010101011100011011000000000001000100011110000010100000000001011101010101110010100100011101000101100101000000010101000110110001011001010111000010100001110000000000010100000000100000000000010100110001100100001010000100110001011001011100010000010001001000011101000100110100111100010011000010100101000000000100000111110001011000000111000001110001001100001010000001000100000100011101000101100000000100001010000000000100010000010110000011100000000100010100000100100001101100000001"
    var keysize = Decrypt.getKeySize(str, [2, 12], 2)
    
    expect(keysize).toContain(8)
  })

  it("should transpose blocks of bytes", function() {
    var str = '000000111111000111010101000000'

    var tb = Decrypt.transpose(str, 2, 3)
    expect(tb).toEqual(['000111000010000', '000111111101000'])
  })

  it("should decrypt repeat-key XOR encoding", function() {
    // var input = fs.readFileSync('../tests/6.txt', { encoding: 'UTF8'})
    var str = "0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f"
    var message = "Burning 'em, if you ain't quick and nimble\nI go crazy when I hear a cymbal"

    var keys = Decrypt.getRepeatKey(str, { keyrange: [2, 8], keytries: 2 })
    expect(keys).toContain('ICE')
  })
})



