const { normalizeOptions } = require('./utils.js')
const initTiny = require('./initTiny.js')
const compressTiny = require('./compressTiny.js')

const esigntiny = async function (options) {
  options = normalizeOptions(options)
  const taskExample = compressTiny(initTiny(options))

  taskExample.run().catch((err) => console.log(err))
}

module.exports = esigntiny
