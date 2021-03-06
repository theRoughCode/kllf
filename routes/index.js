const routes = require('express').Router();
const data = require('../helpers/data');
const formidable = require('formidable');
const fs = require('fs');
const async = require('async');
const words = require('../helpers/words');

routes.get('/', function(req, res){
  res.render('index');
})

// SUBMIT ITEM
routes.post('/submit', function(req, res){
  var form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files) => {
    if(err) return res.send('Error reading form!');
    data.uploadImage(files.pic, id => res.redirect(`/predict/${id}`));
  });
});

// RETRIEVE ITEM
routes.get('/retrieve/:id', function(req, res) {
  data.retrieveItem(req.params.id, field => {
    data.getImage(field.img_id, img => {
      if(field.bid === 'no') field.duration = null;
      res.render('display', {
        name: field.name,
        desc: field.desc,
        qty: field.qty,
        cat: field.category,
        bid: field.bid,
        duration: field.duration,
        price: field.price,
        img: `data:${img.contentType};base64,${new Buffer(img.data).toString('base64')}`
      });
    });
  });
});

// RETRIEVE IMAGE
routes.get('/img/:id', function(req, res) {
  data.getImage(req.params.id, img => {
    res.contentType(img.contentType);
    res.end(img.data, 'binary');
  });
});

routes.get('/predict/:img_id', function (req, res) {
  data.getImage(req.params.img_id, img => {
    words.predict(new Buffer(img.data).toString('base64'), result =>{
      res.render('display', {
        img: `data:${img.contentType};base64,${new Buffer(img.data).toString('base64')}`,
        words: result
      });
      data.deleteImage(req.params.img_id, () => {});
    });
  });
})

module.exports = routes;
