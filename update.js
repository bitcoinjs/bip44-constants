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

    // Used in case of duplicate
    const description = $(cols[3]).text().trim()

    // turn invisible characters into '?' for visibility when logging
    const oldConstant = $(cols[1]).text().trim().replace(/[^a-fA-F0-9x]/g, '?')
    // remove any characters besides 'x' and hex characters
    const newConstant = oldConstant.normalize('NFKD').replace(/[^a-fA-F0-9x]/g, '')
    if (newConstant.length !== 10 || !newConstant.match(/^0x[a-fA-F0-9]{8}$/)) {
      console.error(`"${coin}" is improper format: "${oldConstant}" and we couldn't fix it... Skipping.`)
      return // constant was improper format
    }
    if (constants[coin]) {
      console.error(`"${coin}" is a duplicate`)
      if (!(constants[coin] instanceof Array)) {
        constants[coin] = [constants[coin], { val: newConstant, desc: description }]
      } else {
        constants[coin].push({ val: newConstant, desc: description })
      }
    } else {
      constants[coin] = { val: newConstant, desc: description }
    }
  })

  console.log('module.exports = {')
  const keys = Object.keys(constants)
  keys.sort().forEach((key, i) => {
    if (constants[key] instanceof Array) {
      for (let j = 0; j < constants[key].length; j++) {
          console.log(`  "${key}_${j}": ${constants[key][j].val}` +
                      `${i + 1 === keys.length ? '' : ','} ` +
                      `// ${constants[key][j].desc || 'No Description'}`)
      }
    } else {
      console.log(`  "${key}": ${constants[key].val}${i + 1 === keys.length ? '' : ','}`)
    }
  })
  console.log('}')
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
