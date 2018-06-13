const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();

module.exports = function(app, passport) {

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });


  const upload = multer({storage: storage});

  const Products = require('./models/products');
  app.get('/', function(req, res) {
    res.render('screens/homepage/index.ejs', {
      title: 'Elan - Slogan',
      style: 'index.css',
      logic: 'index.js',
    });
   });
   app.get('/collections', function(req, res) {
     res.render('screens/collections/index.ejs', {
       title: 'Elan - Slogan',
       style: 'collections.css',
       logic: 'collections.js',
     });
    });
    app.get('/collections/frames', function(req, res) {
      Products.find({ category: 'frame'}, function (err, docs){
        res.render('screens/collections/screens/frames/index.ejs', {
          title: 'Elan - Slogan',
          style: 'frames.css',
          logic: 'frames.js',
          products: docs
        });
      });
     });
     app.get('/collections/desserts', function(req, res) {
       Products.find({ category: 'dessert'}, function (err, docs){
       res.render('screens/collections/screens/desserts/index.ejs', {
         title: 'Elan - Slogan',
         style: 'desserts.css',
         logic: 'desserts.js',
         products: docs
       });
     });
      });
    app.get('/collections/photobooth', function(req, res) {
      Products.find({ category: 'photobooth'}, function (err, docs){
        res.render('screens/collections/screens/photobooth/index.ejs', {
          title: 'Elan - Slogan',
          style: 'photobooth.css',
          logic: 'photobooth.js',
          products: docs
        });
      });
      });
      app.get('/collections/miscellaneous', function(req, res) {
        Products.find({ category: 'miscellaneous'}, function (err, docs){
          res.render('screens/collections/screens/miscellaneous/index.ejs', {
            title: 'Elan - Slogan',
            style: 'miscellaneous.css',
            logic: 'miscellaneous.js',
            products: docs
          });
        });
        });
    app.get('/galleries', function(req, res) {
      res.render('screens/galleries/index.ejs', {
        title: 'Elan - Slogan',
        style: 'galleries.css',
        logic: 'galleries.js',
      });
     });
     app.get('/pricing', function(req, res) {
       res.render('screens/pricing/index.ejs', {
         title: 'Elan - Slogan',
         style: 'pricing.css',
         logic: 'pricing.js',
       });
      });
      app.get('/contact', function(req, res) {
        res.render('screens/contact/index.ejs', {
          title: 'Elan - Slogan',
          style: 'contact.css',
          logic: 'contact.js',
        });
      });
      app.get('/contact/success', function(req, res) {
        res.render('screens/contact/screens/success/index.ejs', {
          title: 'Elan - Slogan',
          style: 'success.css',
          logic: 'success.js',
        });
      });
    app.post('/contact', function(req, res) {
      var name = req.body.name;
      var email = req.body.email;
      var message = req.body.message;
      nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: email, // sender address
            to: 'bar@example.com, baz@example.com', // list of receivers
            subject: 'New Message', // Subject line
            text: name + message, // plain text body
            html: name + '<br>' + message // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            res.redirect('/contact/success');
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });
    });

    app.get('/admin', function(req, res) {
      res.render('screens/admin/index.ejs', {
        title: 'Elan - Slogan',
        style: 'admin.css',
        logic: 'admin.js',
      })
    });
    app.get('/adminProfile', isLoggedIn, function(req, res) {
      var user = req.user;
      res.render('screens/admin/screens/adminProfile/index.ejs', {
        title: 'Elan - Slogan',
        style: 'admin.css',
        logic: 'admin.js',
        user: user
      })
    });
    app.post('/signup', passport.authenticate('local-signup', {
       successRedirect : '/profile', // redirect to the secure profile section
       failureRedirect : '/signup', // redirect back to the signup page if there is an error
       failureFlash : true // allow flash messages
   }));
   app.post('/login', passport.authenticate('local-login', {
       successRedirect : '/adminProfile', // redirect to the secure profile section
       failureRedirect : '/login', // redirect back to the signup page if there is an error
       failureFlash : true // allow flash messages
   }));

   app.post('/addProduct', upload.single('image'), (req, res, next) => {
     const product = new Products({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        category: req.body.category,
        image: req.file.path,
        price: req.body.price
      });
      console.log(product);
      product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Submitted Product successfully",
        product: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
   });
}


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
