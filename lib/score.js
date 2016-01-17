// # Decryption Scoring

var Score = {}

/* # Letter Frequency
* The input is scored by the frequency of the most common letters in a given language.
* Default language is English (because I speak English).
* - `input` must be a string, preferably not binary or you're wasting electricity.
* - 'opts' is an optional object: 
*   -`lang` (string): currrent support is for the following languages:
*     - "english"
*   - `noUnicode` (bool): ignore unicode sections of code (u/0001)
*
* Output is an integer reflecting the total frequency score. A higher number is better.
*/
Score.frequency = function(input, opts) {
  if (typeof input != 'string')
    return console.error('invalid arg on Score.frequency: input must be a string')
  if (opts && typeof opts != 'object')
    return console.error('invalid arg on Score.frequency: options must be an object')
  //least to most frequent
  var ascii = 'HRMFSDCBWAOTucldrhs nioate'
  var unicode = [10, 72, 82, 77, 70, 83, 68, 67, 66, 87, 65, 79, 84, 117, 99, 108, 100, 114, 104, 115, 20, 110, 105, 111, 97, 116, 101]
  var score = 0

  var letters = opts && opts.noUnicode ? unicode : ascii
  if (opts && opts.noUnicode) {
    input.split('').forEach(function(letter) {
      var code = letter.charCodeAt()
      if (code != 10 && (code < 32 || code == NaN))
        score -= 10000
      else if (code > 128)
        score -= 200
      else {
        score += letters.indexOf(code)
      }
    })
  } else {
    input.split('').forEach(function(letter) {
      score += letters.indexOf(letter)
    })
  }
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