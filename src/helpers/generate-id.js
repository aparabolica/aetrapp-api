const generate = require('nanoid/generate')

/*
  Generates a random id.

  References:
  - https://alex7kom.github.io/nano-nanoid-cc/
  - https://github.com/ai/nanoid
*/
module.exports = function () {
  return generate('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 13)
}
