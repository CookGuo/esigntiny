const Table = require('cli-table')
const chalk = require('chalk')
const path = require('path')
const { sleep } = require('./utils.js')

const headArr = {
  head: ['name', 'status', 'old-size(kb)', 'new-size(kb)', 'compress ratio(%)'],
}
// const table = new Table({
//   head: ,
// })

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
    failedNum = 0,
    failedList = [],
    table = new Table(headArr)

  if (imagesRsult && imagesRsult.length) {
    imagesRsult.forEach((result) => {
      const filePath = result.data.filePath
      if (result.code === 200) {
        totalNewSize += +result.data.info.newSize
        totalOldSize += +result.data.info.oldSize
        successNum += 1
        table.push(getSuccessInfo(result))
      } else {
        const fileName = path.basename(filePath)
        failedNum += 1
        failedList.push(filePath)
        table.push([fileName, 'failed'])
      }
    })
  }
  await sleep(1000)

  console.log(table.toString())

  const resStr = `图片总数量：${
    imagesRsult.length
  }, 压缩成功：${successNum}, 压缩失败：${failedNum}, 压缩比：${
    ((totalOldSize - totalNewSize) / totalOldSize).toFixed(2) * 100
  } (%)`
  console.log(chalk.red(resStr))

  // 2秒后开启失败的压缩
  await sleep(2000)

  return failedList
}
