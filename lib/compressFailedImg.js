const { tinyFun } = require('./utils.js')
const Listr = require('listr')
const resultToChalk = require('./resultToChalk.js')

let compressTimes = 1

module.exports = async function compressFailedImg(failedList, options) {
  const taskExample = new Listr()
  if (compressTimes-- > 0) {
    taskExample.add({
      title: '再次压缩失败图片',
      task: async (ctx, task) => {
        const imagesRsult = await Promise.all(
          tinyFun({
            images: failedList,
            options,
          })
        )
        // 在次压缩失败的图片
        await resultToChalk(imagesRsult)
      },
    })
    taskExample.run().catch((err) => {
      console.log(err)
    })
  }
}
