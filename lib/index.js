const { normalizeOptions } = require('./utils')
const initTiny = require('./initTiny')
const compressTiny = require('./compressTiny')

const esigntiny = async function (options) {
  options = normalizeOptions(options)
  const task = compressTiny(initTiny(options))

  task.run().catch((err) => console.log(err))
  // console.log(task._tasks)
}

module.exports = esigntiny
