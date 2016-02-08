BIP44 Constants
===============

This package provides BIP44 coin constants as found here: https://github.com/satoshilabs/slips/blob/master/slip-0044.md

You can read more about [BIP44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki)


Install
-------

    npm i --save bip44-constants


Usage
-----

```js
var constants = require('bip44-constants')
console.dir(constants)

// iterate through constants
Object.keys(constants).forEach(function (coin) {
  var constant = constants[coin]

  // you'll proabably want to convert to integer
  var constantNum = parseInt(constant, 10)
})
```

Updating
--------

If you notice that `constants.json` is out of date, just run the `./update.sh` script and submit a PR or submit an
issue to notify us.


License
-------

MIT
