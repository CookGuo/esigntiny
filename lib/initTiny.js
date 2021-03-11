const Listr = require('listr')
const { getImsges } = require('./utils')

module.exports = function (options) {
  const task = new Listr()
  task.add(getFiles(options))
  return task
}

function getFiles(options) {
  return {
    title: '获取所有图片数量',
    task: (ctx, task) => {
      ctx.images = getImsges(options.input)
      task.title = `共找到${ctx.images.length}张图`
      console.log(ctx.images)
    },
  }
}
