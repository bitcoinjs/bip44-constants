# BIP44 Constants
[![NPM Package](https://img.shields.io/npm/v/bip44-constants.svg?style=flat-square)](https://www.npmjs.org/package/bip44-constants)

This package provides BIP44 coin constants as found here: https://github.com/satoshilabs/slips/blob/master/slip-0044.md

You can read more about [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)


## Install
```
npm i --save bip44-constants
```

## Usage
```js
const constants = require('bip44-constants')
console.log(constants)

// iterate through constants
Object.keys(constants).forEach(coin => {
  const constant = constants[coin]

  // you'll probably want to convert to integer
  const constantNum = parseInt(constant, 16)
})
```

## Updating
If you notice that `constants.json` is out of date, just run the `./update.sh` script and submit a PR or submit an
issue to notify us.


## LICENSE [MIT](LICENSE)
