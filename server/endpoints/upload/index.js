const express = require('express');
const fs = require('fs');
const Photo = require('../../models/photo');
const randToken = require('rand-token');
const config = require('../../config')

const router = new express.Router();

router.get('/upload', function(req, res) {
  const currentUser = req.user;
  if (!currentUser) {
    res.redirect('/');
    res.end();
    return;
  }

  res.render('upload');
});

router.post('/upload', function (req, res) {
  const currentUser = req.user;

  const dir = config.uploadDirectory;

  const savePath = dir + randToken.generate(16);

  // fs.readFile(req.files.displayImage.path, function (err, data) {
  //   // ...
  //   var newPath = __dirname + "/uploads/uploadedFileName";
  //   fs.writeFile(newPath, data, function (err) {
  //     res.redirect("back");
  //   });

  // TODO Get the image file and save it at save path

  // const newPhoto = new Photo();
  // newPhoto.user = currentUser;
  // newPhoto.url = req.headers.host + savePath;

  res.redirect('/');
});

module.exports = router;
