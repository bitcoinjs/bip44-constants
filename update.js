const fetch = require('node-fetch')

;(async () => {
  const res = await fetch('https://raw.githubusercontent.com/satoshilabs/slips/master/slip-0044.md')
  const body = await res.text()

  // start with "| Coin type" end with "\n\nCoin types "
  const content = body.slice(body.search(/\| Coin type/), body.search('\n\nCoin types '))
  const constants = []

  content.split('\n').forEach((line, i) => {
    if (i < 2) return // skip the header rows

    const cols = line.split('|').map(entry => entry.trim())

    // remove the index from the item, it is redundant
    cols.shift()
    cols.shift()

    while (cols.length > 3) {
      cols.pop()
    }
    while (cols.length < 3) {
      cols.push('')
    }

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
