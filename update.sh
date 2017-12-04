#!/usr/bin/env node

var cheerio = require('cheerio')
var fetch = require('node-fetch')
var fs = require('fs')

var constants = {}
var url = 'https://github.com/satoshilabs/slips/blob/master/slip-0044.md'

fetch(url).then(function (res) {
  return res.text()
})
.then(function (body) {
  var $ = cheerio.load(body)
  $('table tr').each(function (i, el) {
    var cols = $(el).find('td')
    var index = $(cols[0]).text()
    if (!index) return // table header

    var coin = $(cols[2]).text().replace(/\(.*/, '').trim()
    if (!coin) return // not defined yet

    // https://github.com/bitcoinjs/bip44-constants/pull/7
    if (coin === 'Link') throw new Error('Check source code')

    var constant = $(cols[1]).text()
    constants[coin] = constant
    if (coin === 'MIX') constants['Link'] = constant
  })

  console.log(`module.exports = {`)
  let keys = Object.keys(constants)
  keys.sort().forEach((key, i) => {
    console.log(`  "${key}": ${constants[key]}${i === keys.length ? '' : ','}`)
  })
  console.log(`}`)
})
.catch(function (err) {
  console.error(err)
  process.exit(1)
})
