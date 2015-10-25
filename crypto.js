var base16 = '0123456789abcdef',
		base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
		asciiPrint = [32, 126],
		fs = require('fs')

//convert hex str to binary
var hexToBin = function (input) {
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

//convert base-64 str to binary
var base64ToBin = function(input) {
	var b64 = input.split(''),
			zero = '000000'
	//map each b64 digit to a six-digit binary number
	var bin = b64.map(function(num) {
		var digits = base64.indexOf(num).toString(2)
		//add any necessary leading zeroes
		return zero.slice(digits.length) + digits
	})
	//output string
	return bin.join('')
}

//convert ascii string to binary
var asciiToBin = function(input) {
	var text = input.split(''),
			zero = '0000000'
	//map each ascii char to a seven-digit binary number
	results = text.map(function(c) {
		var digits = c.charCodeAt().toString(2)
		return zero.slice(digits.length) + digits
	})

	return results.join('')
}

//convert binary string to hex
var binToHex = function (input) {
	//check if leading zeroes are necessary
	var //base = '0123456789abcdef',
			pre = input.length % 4,
			zero = '0000'
	input = pre !== 0 ? zero.slice(pre) + input : input
	//create array of 4-digit binary sets
	var sets = input.match(/\d{4}/g)
	//map each binary set to a hex digit
	var result = sets.map(function(num) {
		return base16[parseInt(num, 2)]
	})
	//return as string
	return result.join('')
}

//convert binary string to base-64
var binTo64 = function (input) {
	//check if leading zeroes are necessary
	var //base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
			pre = input.length % 6,
			zero = '000000'

	input = pre !== 0 ? zero.slice(pre) + input : input
	//create array of 6-digit binary sets
	var sets = input.match(/\d{6}/g)
	//map each binary set to a base-64 digit
	var result = sets.map(function(num) {
		return base64[parseInt(num, 2)]
	})
	//return as string
	return result.join('')
}

var binToAscii = function(input) {
	//check if leading zeroes are necessary
	var pre = input.length % 8,
			zero = '00000000'

	input = pre !== 0 ? zero.slice(pre) + input : input

	var sets = input.match(/\d{8}/g)

	var result = sets.map(function(set) {
		return String.fromCharCode( parseInt(set, 2) )
	})

	return result.join('')
}

var asciiToHex = function(input) {
	var result = input.split('').map(function(c) {
		//find decimal code and convert to hex
		return c.charCodeAt().toString(16)
	})
	return result.join('')
}

var hexToAscii = function(input) {
	var result = input.match(/[\d|\w]{2}/g).map(function(h) {
		//convert to decimal then find ascii for that code
		var d = parseInt(h, 16)
		//remove non-printing chars
		if (asciiPrint[0] <= d && d <= asciiPrint[1] )
			return String.fromCharCode(d)
	})
	return result.join('')
}

//xor hex str by hex
var xorHexToHex = function (a, b) {
	var	a = hexToBin(a).split(''),
			b = hexToBin(b).split('')
		//XOR unequal binaries
	var binA = a.length, 
		binB = b.length,
		result = a.map(function(_, i) {
			return a[i % binA] === b[i % binB] ? 0 : 1
		}) 

	return binToHex(result.join(''))
}

// xor hex str by ascii
var xorHexAscii = function (input) {
	var results = []

	//iterate through each combo of hex pairs
	for (var i = asciiPrint[0]; i <= asciiPrint[1]; i++) {
		
				//convert i to hex
		var c = i.toString(16),
				//do xor
				xor = xorHexToHex(input, c),
				//cut into pairs
				hex = xor.match(/[a-f|0-9]{2}/g)
				
		//convert to ascii
		var result = hex.map(function(hexNum) {
			var num = parseInt(hexNum, 16)
			//strip non-printable chars
			if (asciiPrint[0] <= num && num <= asciiPrint[1])
				return String.fromCharCode(num)
		})
		results.push(result.join(''))
	}
	//check for common text
	return commonLetters(results)

}

//return array elem with most common letters
var commonLetters = function(array) {
	//most common letters, from least to most often
	var letters = 'uUlLdDrRhHsS nNiIoOtTeE',
			highScore = {'score': -999, 'message': ''}

	array.forEach(function(message) {
		var score = 0
		//find score for this result
		message.split('').forEach(function(l) {
			score += letters.indexOf(l)
		})
		//replace second best match
		if(score > highScore.score)
			highScore = {'score': score, 'message': message}
	})
	return highScore.message
}

//xor all lines of a file and return best match
var fileXOR1 = function(file) {
	//read file as text and split by line
	var lines = fs.readFileSync(file, 'utf8').split('\n')

	var results = lines.map(function(line) {
		//xor line and return best match
		var xor = xorHexAscii(line)
		if (xor.length > 0)
			return xor
	})
	//return best match of all lines
	return commonLetters(results)
}

//Repeating-key XOR Encryption
var repeatKeyXorEncrypt = function(key, input) {
	var keys = asciiToHex(key),
			messages = input.split('\n')
	//convert each line to hex
	var results = messages.map(function(message) {
		message = asciiToHex(message)
		//XOR hex messages
		return xorHexToHex(message, keys)
	})
	//reconnect lines
	return results.join('\n')

}

//Repeating-Key XOR decryption
var repeatKeyXorDecrypt = function(key, input) {
	var keys = asciiToHex(key),
			messages = input.split('\n')
	//XOR each line of hex message and convert to ascii
	var results = messages.map(function(message) {
		return hexToAscii(xorHexToHex(message, keys))
	})
	//reconnect lines
	return results.join('\n')
}

var aa = repeatKeyXorEncrypt('<div>', 'now is the time for all good men to come to the aid of their country!')
//execute
console.log(
aa,	repeatKeyXorDecrypt('<div>', aa)
)

