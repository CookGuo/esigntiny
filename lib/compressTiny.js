const resultToChalk = require('./resultToChalk.js')
const compressFailedImg = require('./compressFailedImg.js')
const { tinyFun } = require('./utils.js')

module.exports = function (taskExample) {
  taskExample.add({
    title: '压缩图片',
    task: async (ctx, task) => {
      const imagesRsult = await Promise.all(tinyFun(ctx))
      // 在次压缩失败的图片
      const failedList = await resultToChalk(imagesRsult)
      await compressFailedImg(failedList, taskExample)
    },
  })

  return taskExample
}
