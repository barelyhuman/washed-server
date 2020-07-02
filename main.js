const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const Jimp = require('jimp');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());


const storage = multer.memoryStorage();

const upload = multer({ storage: storage })



app.post('/uploadfile', upload.single('imageFile'), (req, res, next) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    return res.status(400).send({
      message: 'Something went wrong'
    });
  }

  Jimp.read(file.buffer)
    .then(fileInstance => {

      fileInstance
        .brightness(0.18)
        .contrast(-0.05)
        .getBase64(Jimp.MIME_JPEG, (err, dataString) => {

          if (err) {
            res.status(err.status).send({
              message: err
            });
          }

          return res.send({
            success: true,
            dataURL: dataString,
            fileName: Date.now() + '-washed.jpg'
          });
        });

    })
    .catch(err => {
      console.log(err);
      return res.status(400).send({
        message: 'Something went wrong'
      });
    })
});

app.listen(PORT, () => {
  console.log("Listening on: ", PORT);
});





