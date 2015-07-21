var test = require('tape')

test('should load and be proper JSON', function (t) {
  var constants = require('./')
  t.ok(Object.keys(constants).length > 10)
  t.end()
})
