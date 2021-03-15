const { tinyFun } = require('./utils.js')
const resultToChalk = require('./resultToChalk.js')

let compressTimes = 2

module.exports = async function compressFailedImg(failedList, taskExample) {
  if (compressTimes-- > 0) {
    taskExample.add({
      title: '再次压缩失败图片',
      task: async (ctx, task) => {
        const imagesRsult = await Promise.all(
          tinyFun({
            images: failedList,
            options: ctx.options,
          })
        )
        // 在次压缩失败的图片
        await compressFailedImg(await resultToChalk(imagesRsult), taskExample)
      },
    })
  }
}
