const path = require('path')
const fs = require('fs')

const log = (content) => {
  console.log('----tests======', content)
}
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
    options.output = path.resolve(getCwd())
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
}
