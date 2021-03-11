const { normalizeOptions } = require('./utils')
const initTiny = require('./initTiny')

const esigntiny = async function (options) {
  options = normalizeOptions(options)
  // console.log(options, 'ppp')
  // const task =
  const task = initTiny(options)

  task.run()
  // compressTiny(task, options)
}

module.exports = esigntiny
