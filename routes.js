const express = require('express');
const nodeMailer = require('nodemailer');
const multer = require('multer');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('./models/users');
const Cart = require('./models/cart');

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
    var user = req.user;
    res.render('screens/homepage/index.ejs', {
      title: 'Elan - Slogan',
      style: 'index.css',
      logic: 'index.js',
      user: user
    });
   });
   app.get('/collections', function(req, res) {
     var user = req.user;
     if (user.local.email === 'elandecorrental@gmail.com') {
       res.redirect('/adminProfile');
     } else {
     res.render('screens/collections/index.ejs', {
       title: 'Elan - Slogan',
       style: 'collections.css',
       logic: 'collections.js',
       user: user
     });
   }
    });
    app.get('/collections/frames', function(req, res) {
      var user = req.user;
      Products.find({ category: 'frame'}, function (err, docs){
        res.render('screens/collections/screens/frames/index.ejs', {
          title: 'Elan - Slogan',
          style: 'frames.css',
          logic: 'frames.js',
          products: docs,
          user: user
        });
      });
     });
     app.get('/collections/desserts', function(req, res) {
       var user = req.user;
       Products.find({ category: 'dessert'}, function (err, docs){
       res.render('screens/collections/screens/desserts/index.ejs', {
         title: 'Elan - Slogan',
         style: 'desserts.css',
         logic: 'desserts.js',
         products: docs,
         user: user
       });
     });
      });
    app.get('/collections/photobooth', function(req, res) {
      var user = req.user;
      Products.find({ category: 'photobooth'}, function (err, docs){
        res.render('screens/collections/screens/photobooth/index.ejs', {
          title: 'Elan - Slogan',
          style: 'photobooth.css',
          logic: 'photobooth.js',
          products: docs,
          user: user
        });
      });
      });
      app.get('/collections/miscellaneous', function(req, res) {
        var user = req.user;
        Products.find({ category: 'miscellaneous'}, function (err, docs){
          res.render('screens/collections/screens/miscellaneous/index.ejs', {
            title: 'Elan - Slogan',
            style: 'miscellaneous.css',
            logic: 'miscellaneous.js',
            products: docs,
            user: user
          });
        });
        });

    app.get('/product/:id?', function(req, res) {
      const id = req.params.id;
      var user = req.user;
      Products.findOne({ _id: id}, function (err, docs){
        res.render('screens/collections/screens/productSingle/index.ejs', {
          title: 'Elan - Slogan',
          style: 'productSingle.css',
          logic: 'productSingle.js',
          product: docs,
          user: user
        });
      });
    });
    app.post('/addToCart', (req, res, next) => {
      const cart = new Cart({
         _id: new mongoose.Types.ObjectId(),
         userId: req.user._id,
         name: req.body.name,
         price: req.body.price,
         status: 'new'
       });
       cart
     .save()
     .then(result => {
       res.redirect('/shoppingCart');
     })
     .catch(err => {
       console.log(err);
       res.status(500).json({
         error: err
       });
     });
    });

    app.post('/checkout', function(req, res) {
      var products = [];
      Cart.find({userId: req.user._id, status: 'new'}, function(err, docs) {
        if (err) throw err;
          docs.forEach(function(doc) {
            var newProduct = {name: doc.name, price: doc.price};
            products.push(newProduct);
            Cart.findByIdAndUpdate(doc._id, {status : 'old'}, {new: true}, function(err, docs){
              if(err) throw err;
              console.log(docs);
            });
          });
          console.log(products);
          var name = req.user.local.firstName;
          var email = req.user.local.email;
          var message = JSON.stringify(products);

          var transporter = nodeMailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'elandecorrental@gmail.com',
                pass: 'Gufour123!'
              }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: email, // sender address
                to: 'elandecorrental@gmail.com', // list of receivers
                subject: 'New Message', // Subject line
                text: name + message, // plain text body
                html: name + '<br>' + message + '<br>' + email// html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              console.log('Message %s sent: %s', info.messageId, info.response);
                  res.redirect('contact/success');
              });
      });
    });

    app.get('/galleries', function(req, res) {
      var user = req.user;
      Products.find({}, function (err, docs){
      res.render('screens/galleries/index.ejs', {
        title: 'Elan - Slogan',
        style: 'galleries.css',
        logic: 'galleries.js',
        products: docs,
        user: user
      });
    });
     });
     app.get('/pricing', function(req, res) {
       var user = req.user;
       res.render('screens/pricing/index.ejs', {
         title: 'Elan - Slogan',
         style: 'pricing.css',
         logic: 'pricing.js',
         user: user
       });
      });
      app.get('/contact', function(req, res) {
        var user = req.user;
        res.render('screens/contact/index.ejs', {
          title: 'Elan - Slogan',
          style: 'contact.css',
          logic: 'contact.js',
          user: user
        });
      });
      app.get('/contact/success', function(req, res) {
        var user = req.user;
        res.render('screens/contact/screens/success/index.ejs', {
          title: 'Elan - Slogan',
          style: 'success.css',
          logic: 'success.js',
          user: user
        });
      });
    app.post('/contact', function(req, res) {
      var name = req.body.name;
      var email = req.body.email;
      var message = req.body.message;

      var transporter = nodeMailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'elandecorrental@gmail.com',
            pass: 'Gufour123!'
          }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: email, // sender address
            to: 'elandecorrental@gmail.com', // list of receivers
            subject: 'New Message', // Subject line
            text: name + message, // plain text body
            html: name + '<br>' + message // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.redirect('contact/success');
          });
      });

    app.get('/signup', function(req, res) {
      var user = req.user;
      res.render('screens/signup/index.ejs', {
        title: 'Elan - Slogan',
        style: 'signup.css',
        logic: 'signup.js',
        user: user
      })
    });

    app.get('/login', function(req, res) {
      var user = req.user;
      res.render('screens/login/index.ejs', {
        title: 'Elan - Slogan',
        style: 'login.css',
        logic: 'login.js',
        user: user
      })
    });

    app.get('/shoppingCart', function(req, res) {
      var user = req.user;
      Cart.find({ userId: req.user._id, status: 'new'}, function (err, docs){
        res.render('screens/shoppingCart/index.ejs', {
          title: 'Elan - Slogan',
          style: 'shoppingCart.css',
          logic: 'shoppingCart.js',
          user: user,
          cart: docs
        });
      });
    });

    app.get('/admin', function(req, res) {
      var user = req.user;
      res.render('screens/admin/index.ejs', {
        title: 'Elan - Slogan',
        style: 'admin.css',
        logic: 'admin.js',
        user: user
      })
    });
    app.get('/adminProfile', isLoggedIn, function(req, res) {
      var user = req.user;
      if (user.local.email === 'elandecorrental@gmail.com') {
        Products.find({}, function(err, docs) {
          if (err) throw err;
          res.render('screens/admin/screens/adminProfile/index.ejs', {
            title: 'Elan - Slogan',
            style: 'admin.css',
            logic: 'admin.js',
            user: user,
            products: docs
          });
        });
      } else {
        res.render('screens/notFound/index.ejs', {
          title: 'Elan - Slogan',
          style: 'notFound.css',
          logic: 'notFound.js',
          user: user
        });
      }
    });

    app.post('/removeProduct', function(req, res) {
      Products.findByIdAndRemove(req.body.id, function (err,offer){
          if(err) { throw err; }
          res.redirect('/adminProfile');
      });
    });
    app.post('/signup', passport.authenticate('local-signup', {
       successRedirect : '/collections', // redirect to the secure profile section
       failureRedirect : '/signup', // redirect back to the signup page if there is an error
       failureFlash : true // allow flash messages
   }));
   app.post('/login', passport.authenticate('local-login', {
       successRedirect : '/collections', // redirect to the secure profile section
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

   app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('*', function(req, res) {
      var user = req.user;
      res.render('screens/notFound/index.ejs', {
        title: 'Elan - Slogan',
        style: 'notFound.css',
        logic: 'notFound.js',
        user: user
      })
    });
}


function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
