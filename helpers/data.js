const fs = require('fs');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('dotenv').config();

//  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Storage  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

mongoose.connect(process.env.MONGOOSE);

var ImageSchema = new Schema({
  img: { data: Buffer, contentType: String }
});
var Image = mongoose.model('Image', ImageSchema);

// UPLOAD IMAGE
function uploadImage(img, callback) {
  var image = new Image();
  image.img.data = fs.readFileSync(img.path);
  image.img.contentType = img.type;
  image.save((err, saved) => callback(saved.id));
}

// RETRIEVE IMAGE
// returns Image Schema
function getImage(id, callback) {
  Image.findById(id, (err, img) => callback(img.img));
}

// DELETE IMAGE
function deleteImage (id, callback) {
  Image.find({ _id: id }, (err, data) => {
    if (err) {
      console.error("Image not found.");
      return callback(1);
    }
    if(data.length === 0) return callback(1);
    data[0].remove((err, res) => {
      if (err) {
        console.error("Error deleting image.");
        return callback(1);
      }
      console.log("Successfully deleted image.");
      callback(0);
    });
  });
}

module.exports = {
  uploadImage,
  getImage
}
