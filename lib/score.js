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
    return console.error('invalid arg on Score.frequency: input must be a string')
  //least to most frequent
  var letters = 'ucldrhsnioate'
  var score = 0

  input.split('').forEach(function(letter) {
    score += letters.indexOf(letter)
  })

  return score
}

/* # Digraph Frequency
* The input is scored by the frequency of the most common letter pairs in a given language.
* Default language is English.
* `input` must be a string.
* `lang` is optional: currrent support is for the following languages:
* - "english"
*
* Output is an integer reflecting the total frequency score. A higher number is better.
*/
Score.digraph = function(input, lang) {
  if (typeof input != 'string')
    return console.error('invalid arg on Score.digraph: input must be a string')
  //least to most frequent
  var digraphs = [
    "ve", "rt", "de", "as", "ar", "ou", "is", "le", "io", "st",
    "it", "to", "ti", "ea", "nt", "or", "of", "es", "en", "at",
    "ha", "nd", "ed", "in", "he", "re", "an", "on", "er", "th"
  ]

  var score = 0
  digraphs.forEach(function(d, i) {
    var regex = new RegExp(d, 'g')
    var matches = input.match(regex)
    if (matches) {
      matches.forEach(function() {
        score += i
      })
    }
  })

  return score
}

module.exports = Score