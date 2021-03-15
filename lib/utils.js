const path = require('path')
const fs = require('fs')
const { request, get } = require('https')
const { createReadStream, createWriteStream, existsSync, mkdirSync } = fs

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
            // console.log('[[[[[]]]]]', info)
            if (/^\s*</g.test(info) || info.error) {
              resolve(
                getMessage({
                  info,
                  filePath,
                  msg: '压缩失败',
                  code: 500,
                })
              )
              return
            }
            resolve(await getImageData(info, options, filePath))
          } catch (e) {
            // console.log(e, '))0')
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

/**
 * 读取图片，写入文件
 */
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

const log = (content) => {
  console.log('----tests======', content)
}

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time))

/**
 * 获取文件执行的根目录
 */
const getCwd = () => {
  return process.cwd()
}
/**
 * 初始化参数
 */
const normalizeOptions = (options) => {
  if (!options.input) {
    options.input = path.resolve(getCwd(), './assets/images')
  }
  if (!options.output) {
    options.output = options.input
  }

  const inputStat = fs.statSync(options.input)

  const outputStat = fs.statSync(options.output)

  if (!inputStat.isDirectory() || !outputStat.isDirectory()) {
    throw new Error('options input or output must directory')
  }

  return options
}

/**
 * 获取所有图片
 */
const getImsges = (input) => {
  let imageList = []
  const images = fs.readdirSync(input)

  images.forEach((file) => {
    const fullPath = path.resolve(input, file)
    const stat = fs.statSync(fullPath)
    if (stat.isFile() && checkFileType(file)) {
      imageList.push(fullPath)
    }
    if (stat.isDirectory()) {
      imageList = imageList.concat(getImsges(fullPath))
    }
  })
  return imageList
}

/**
 * 检查文件是否合规
 */
const checkFileType = (file) => {
  const ext = path.extname(file)
  if (/[jpeg][png]/.test(ext)) {
    return true
  }
  return false
}

module.exports = {
  normalizeOptions,
  getImsges,
  sleep,
  getCwd,
  tinyFun,
}
