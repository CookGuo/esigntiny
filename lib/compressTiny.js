const path = require('path')
const { request, get } = require('https')
const {
  createReadStream,
  createWriteStream,
  existsSync,
  mkdirSync,
} = require('fs')
// const { checkType } = require('./util')
const parms = {
  hostname: 'tinypng.com',
  port: 443,
  path: '/web/shrink',
  method: 'POST',
  headers: {
    'User-Agent':
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  },
}

/**
 * 将每个文件压缩返回promise
 * compressFile包装每一个请求链接
 */
const tinyFun = (ctx) => {
  const { images, options } = ctx
  return images.map((item) => {
    return compressFile(item, options)
  })
}

/**
 * 压缩文件
 */

const compressFile = (filePath, options) => {
  return new Promise((resolve, reject) => {
    createReadStream(filePath).pipe(
      request(parms, (res) => {
        res.on('data', async (info) => {
          try {
            info = JSON.parse(info.toString())
            if (/^\s*</g.test(info) || info.error) {
              resolve(
                getMessage({
                  info,
                  filePath,
                  msg: '压缩失败',
                  code: 500,
                })
              )
            }
            resolve(await getImageData(info, options, filePath))
          } catch (e) {
            console.log(e, '))0')
            resolve(
              getMessage({
                info,
                filePath,
                msg: '接口请求被拒绝',
                code: 500,
              })
            )
          }
        })
      })
    )
  })
}

const getImageData = (imageInfo, options, filePath) => {
  let output = options.output
  const input = options.input
  const imageUrl = imageInfo.output.url
  const oldSize = (imageInfo.input.size / 1024).toFixed(2)
  const newSize = (imageInfo.output.size / 1024).toFixed(2)
  return new Promise((resolve, reject) => {
    get(imageUrl, (res) => {
      const outDir = path.dirname(output)
      output = filePath.replace(input, output)
      if (!existsSync(outDir)) {
        mkdirSync(outDir)
      }
      res.pipe(createWriteStream(output))

      res.on('end', function () {
        resolve(
          getMessage({
            code: 200,
            filePath,
            msg: '压缩成功',
            info: {
              oldSize,
              newSize,
              imageUrl,
            },
          })
        )
      })
    })
  })
}
/**
 * 接口的文案提示
 */
const getMessage = ({ msg, code, info, filePath }) => {
  return {
    code: code || 400,
    msg: msg || '成功',
    data: {
      filePath,
      info,
    },
  }
}

module.exports = function (task) {
  task.add({
    title: '压缩图片',
    task: async (ctx, task) => {
      const imagesRsult = await Promise.all(tinyFun(ctx))
      console.log(imagesRsult)
    },
  })

  return task
}
