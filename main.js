const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const PORT = process.env.PORT || 3000;
const UPLOADDIR = 'uploads';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve(__dirname, UPLOADDIR);
    console.log({ dir });
    mkdirp(dir, err => cb(err, dir));
  },
  filename: function (req, file, cb) {
    cb(null, "" + Date.now())
  }
})

const upload = multer({ storage: storage })


app.get('/ping', (req, res) => {
  res.send("Ping Successful");
});


app.post('/uploadfile', upload.single('imageFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    return res.status(400).send({
      message: 'Something went wrong'
    });
  }

  const filename = file.path + '.jpg';

  Jimp.read(file.path)
    .then(fileInstance => {

      fileInstance
        .brightness(0.18)
        .contrast(-0.18)
        .color([{ apply: 'lighten', params: [3] }])
        .write(filename);

      return res.send({
        success: true,
        file: filename
      });

    })
    .catch(err => {
      console.log(err);
      return res.status(400).send({
        message: 'Something went wrong'
      });
    })
});

app.get('/download', (req, res) => {

  if (!req.query.filename) {
    return res.end();
  }

  const filePath = path.resolve(__dirname, req.query.filename);
  const fileNameForSave = 'washed' + Date.now() + '.jpg';

  return res.download(filePath, fileNameForSave, (err) => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }

    deleteAllUploads()

  })


});


const deleteAllUploads = () => {
  const dir = path.resolve(__dirname, UPLOADDIR);
  fs.readdir(dir, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(dir, file), err => {
        if (err) throw err;
      });
    }
  })
}


app.listen(PORT, () => {
  console.log("Listening on: ", PORT);
});





