const express = require('express');
const fs = require('fs');
const Photo = require('../../models/photo');
const randToken = require('rand-token');
const config = require('../../config');
const multer = require('multer');
const path = require('path');

const router = new express.Router();
const upload = multer({dest: '/tmp'});

router.post('/upload', upload.single('file'), function(req, res) {
  if (!req.file) {
    res.redirect('back');
    return;
  }

  const newFileName = randToken.generate(32).toLowerCase();
  const uploadDirectory = config.uploadDirectory;
  const extension = path.extname(req.file.originalname);

  const filePath = uploadDirectory + newFileName + extension;

  fs.readFile(req.file.path, function(error, data) {
    if (error) {
      res.send(error);
      return;
    }

    fs.writeFile(path.join(__dirname, '../../../', filePath), data, function(err) {
      if (err) {
        res.send(err);
        return;
      }

      const newPhoto = new Photo();
      newPhoto.user = req.user;
      newPhoto.url = filePath;

      newPhoto.save(function(error) {
        if (error) {
          res.send(error);
          return;
        }

        req.user.photos.push(newPhoto);
        req.user.save(function(err) {
          if (err) {
            res.send(err);
            return;
          }

          res.redirect('back');
        });
      });
    });
  });
});

module.exports = router;
