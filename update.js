const cheerio = require('cheerio')
const fetch = require('node-fetch')

;(async () => {
  const res = await fetch('https://github.com/satoshilabs/slips/blob/master/slip-0044.md')
  const body = await res.text()

  const constants = []
  const $ = cheerio.load(body)
  $('table tr').each((i, el) => {
    if (i === 0) return // skip the header

    const cols = Array.from($(el).find('td').map((idx, elem) => {
      return $(elem).text().trim()
    }))

    // remove the index from the item, it is redundant
    cols.shift()

    if (cols[1] === '' && cols[2] === '') return // remove empty rows

    // turn invisible characters into '?' for visibility when logging
    cols[0] = cols[0].replace(/[^a-fA-F0-9x]/g, '?')
    // remove any characters besides 'x' and hex characters
    const newConstant = cols[0].normalize('NFKD').replace(/[^a-fA-F0-9x]/g, '')
    if (newConstant.length !== 10 || !newConstant.match(/^0x[a-fA-F0-9]{8}$/)) {
      console.error(`Row #${i} is improper format: "${cols[0]}" and we couldn't fix it... Consider warning in new release`)
      constants.push(cols)
      return
    }
    cols[0] = newConstant
    constants.push(cols)
  })

  console.log('// Format for each row:')
  console.log('// [ constant, coinSymbol, coinName ]')
  console.log('module.exports = [')
  constants.forEach((row, i) => {
    let replaceString = '[$1'
    if (!row[0].match(/^0x[a-fA-F0-9]{8}$/)) replaceString = '[\'$1\''
    const rowString = JSON.stringify(row)
      .replace(/'/g, '\\\'')
      .replace(/"/g, '\'')
      .replace(/^\['([^']*)'/, replaceString)
      .replace(/,/g, ', ')
    console.log(`  ${rowString}${i + 1 === constants.length ? '' : ','}`)
  })
  console.log(']')
})().catch((err) => {
  console.error(err)
  process.exit(1)
})
