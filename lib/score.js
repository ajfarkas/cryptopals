// # Decryption Scoring

var Score = {}

/* # Letter Frequency
* The input is scored by the frequency of the most common letters in a given language.
* Default language is English (because I speak English).
* `input` must be a string, preferably not binary or you're wasting electricity.
* `lang` is optional: currrent support is for the following languages:
* - "english"
*
* Output is an integer reflecting the total frequency score. A higher number is better.
*/
Score.frequency = function(input, lang) {
  if (typeof input != 'string')
    return console.error('invalid input on Score.frequency: input must be a string')
  //least to most frequent
  var letters = 'zqxjkvbpygfwmucldrhsnioate'
  var score = 0

  input.split('').forEach(function(letter) {
    score += letters.indexOf(letter.toLowerCase())
  })

  return score
}

module.exports = Score