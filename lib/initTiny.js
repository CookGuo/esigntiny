const Listr = require('listr')
const { getImsges } = require('./utils.js')

module.exports = function (options) {
  const taskExample = new Listr()
  taskExample.add(getFiles(options))
  return taskExample
}

function getFiles(options) {
  return {
    title: '获取所有图片数量',
    task: (ctx, task) => {
      ctx.options = options
      ctx.images = getImsges(options.input)
      task.title = `共找到${ctx.images.length}张图`
      if (ctx.images.length === 0) {
        Promise.reject('未找到图片')
      }
    },
  }
}
