const multer = require('multer')
const cors = require('cors')
const Jimp = require('jimp')
const mkdirp = require('mkdirp')
const path = require('path')
const fs = require('fs').promises
const runMiddleware = require('../lib/run-middleware')

const FILE_PATH = require('../lib/file-path')
const { FILE } = require('dns')

mkdirp(FILE_PATH)
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(404)
      return res.end()
    }

    await runMiddleware(req, res, cors())
    await runMiddleware(req, res, upload.single('imageFile'))

    const file = req.file

    if (!file) {
      const error = new Error('Please upload a file')
      res.status(400)
      return res.send({
        message: 'Something went wrong',
        error: String(error)
      })
    }

    const fileName = Date.now() + '.jpg'

    await fs.writeFile(path.join(FILE_PATH, fileName), file.buffer)

    res.send({
      fileName: fileName,
      status: 0
    })

    const filePath = path.join(FILE_PATH, fileName)

    const fileInstance = await Jimp.read(filePath)

    const noExtension = fileName.replace('.jpg', '')

    const washedFilePath = path.join(FILE_PATH, `${noExtension}-washed.jpg`)

    fileInstance
      .brightness(0.25)
      .contrast(-0.25)
      .color([{ apply: 'mix', params: ['black', 25] }])
      .write(washedFilePath)
  } catch (err) {
    console.error(err)
    throw err
  }
}
