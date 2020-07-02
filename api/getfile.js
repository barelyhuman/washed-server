const Jimp = require('jimp')
const path = require('path')
const cors = require('cors')
const fs = require('fs').promises
const runMiddleware = require('../lib/run-middleware')

const FILE_PATH = require('../lib/file-path')
const { EEXIST } = require('constants')

module.exports = async (req, res) => {
  let _filename
  try {
    if (req.method !== 'GET') {
      res.status(404)
      return res.end()
    }

    await runMiddleware(req, res, cors())

    const { filename } = req.query
    _filename = filename
    const noExtension = filename.replace('.jpg', '')
    const washedFile = noExtension + '-washed.jpg'
    const washedFilePath = path.join(FILE_PATH, washedFile)
    const stat = await fs.stat(washedFilePath)
    const fileBuffer = await fs.readFile(washedFilePath)

    const dataString = Buffer.from(fileBuffer).toString('base64')
    const dataURL = `data:image/jpg;base64,${dataString}`

    if (stat) {
      res.send({
        fileName: _filename,
        dataURL,
        status: 1
      })
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.send({
        fileName: _filename,
        status: 0
      })
    }
    res.status(500)
    res.send({
      error: String(err)
    })
    throw err
  }
}
