describe("Convert", function() {
  var Convert = require('../lib/convert')
  var binary = '010010010010011101101101001000000110101101101001011011000110110001101001011011100110011100100000011110010110111101110101011100100010000001100010011100100110000101101001011011100010000001101100011010010110101101100101001000000110000100100000011100000110111101101001011100110110111101101110011011110111010101110011001000000110110101110101011100110110100001110010011011110110111101101101'
  var hex = '49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d'
  var b64 = 'SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t'
  var ascii = "I'm killing your brain like a poisonous mushroom"
  
  it("should convert hex to base 64", function() {
    var answer = Convert.hexTo64(hex)
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
    var answer = Convert.asciiTo64(ascii)
    expect(answer).toEqual(b64)
  })
})

describe("Score", function() {
  var Score = require('../lib/score')

  it("should give the letter frequency of a string (English)", function() {
    var string = "Hello World"
    var garbage = "e*0-j 1@"

    expect(Score.frequency(string)).toEqual(175)
    expect(Score.frequency(garbage)).toEqual(22)
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

    var decrypt = Xor.findSingleFrom(encrypt)
    expect(decrypt.msg).toEqual("Cooking MC's like a pound of bacon")
  })
})



