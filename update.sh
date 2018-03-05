#!/usr/bin/env node

const cheerio = require('cheerio')
const fetch = require('node-fetch')

;(async () => {
  const res = await fetch('https://github.com/satoshilabs/slips/blob/master/slip-0044.md')
  const body = await res.text()

  const constants = {}
  const $ = cheerio.load(body)
  $('table tr').each((i, el) => {
    const cols = $(el).find('td')
    const index = $(cols[0]).text()
    if (!index) return // table header

    const coin = $(cols[2]).text().trim()
    if (!coin) return // not defined yet

    const constant = $(cols[1]).text().trim()
    constants[coin] = constant
  })

  console.log('module.exports = {')
  const keys = Object.keys(constants)
  keys.sort().forEach((key, i) => {
    console.log(`  "${key}": ${constants[key]}${i + 1 === keys.length ? '' : ','}`)
  })
  console.log('}')
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
