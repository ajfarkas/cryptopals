# CryptoPals Challenge API


## Table of Contents
- [Basic Conversions](#basic-conversions)
  - [To Binary](#to-binary)
    - [Hexadecimal to Binary](#hexadecimal-to-binary)
    - [Base64 to Binary](#base64-to-binary)
    - [Ascii to Binary](#ascii-to-binary)
  - [From Binary](#from-binary)
    - [Binary to Hex](#binary-to-hex)
    - [Binary to Base64](#binary-to-base64)
    - [Binary to Ascii](#binary-to-ascii)

## Basic Conversions
All conversions use binary as a middle state, if it's not the endpoint.

### To Binary

##### Hexadecimal to Binary

`C.hexToBin( __input__ )`

Input must be valid hexadecimal string (0-9, a-f). Returns `str` composed of `1`s and `0`s

##### Base64 to Binary

`C.base64ToBin( __input__ )`

Input must be valid base64 string (0-9, a-f, A-F, +, /). Returns `str` composed of `1`s and `0`s

##### Ascii to Binary

`C.asciiToBin( __input__ )`

Input must be valid ascii string. Returns `str` composed of `1`s and `0`s

### From Binary

##### Binary to Hex

`C.binToHex( __input__ )`

Input must be `str` composed of `0`s and `1`a. Returns `str` in hex format.

##### Binary to Base64

`C.binTo64( __input__ )`

Input must be `str` composed of `0`s and `1`a. Returns `str` in base64 format.

##### Binary to Ascii

`C.binToAscii( __input__ )`

Input must be `str` composed of `0`s and `1`a. Returns `str` in Ascii format.

