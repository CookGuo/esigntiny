const Table = require('cli-table')
const chalk = require('chalk')
const path = require('path')
const { sleep } = require('./utils')

const table = new Table({
  head: ['name', 'status', 'old-size(kb)', 'new-size(kb)', 'compress ratio(%)'],
})

const getSuccessInfo = (result) => {
  const data = result.data
  const info = data.info
  const fileName = path.basename(data.filePath)
  const compressRatio = parseFloat(
    ((info.oldSize - info.newSize) / info.oldSize) * 100
  ).toFixed(2)

  return [fileName, 'success', info.oldSize, info.newSize, compressRatio]
}

module.exports = async function (imagesRsult) {
  let totalNewSize = 0,
    totalOldSize = 0,
    successNum = 0,
    filedNum = 0

  if (imagesRsult && imagesRsult.length) {
    imagesRsult.forEach((result) => {
      if (result.code === 200) {
        totalNewSize += +result.data.info.newSize
        totalOldSize += +result.data.info.oldSize
        successNum += 1
        table.push(getSuccessInfo(result))
      } else {
        const fileName = path.basename(data.filePath)
        filedNum += 1
        table.push([fileName, 'failed'])
      }
    })
  }
  await sleep(1000)

  console.log(table.toString())

  const resStr = `图片总数量：${
    imagesRsult.length
  }, 压缩成功：${successNum}, 压缩失败：${filedNum}, 压缩比：${
    ((totalOldSize - totalNewSize) / totalOldSize).toFixed(2) * 100
  } (%)`
  console.log(chalk.red(resStr))
}
