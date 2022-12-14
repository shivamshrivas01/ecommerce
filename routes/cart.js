const express = require('express');
const router = express.Router();

const auth = require('../config/auth');
var isUser = auth.isUser;

// Get Product model
const Product = require('../models/product');

/*
 * GET add product to cart
 */
router.get('/add/:product', isUser, function (req, res) {

    var slug = req.params.product;

    Product.findOne({slug: slug}, function (err, p) {
        if (err)
            console.log(err);

        // first time creating cart
        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: slug,
                qty: 1,
                price: parseFloat(p.discountedPrice).toFixed(2),
                image: '/product_images/' + p._id + '/' + p.image
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == slug) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: slug,
                    qty: 1,
                    price: parseFloat(p.discountedPrice).toFixed(2),
                    image: '/product_images/' + p._id + '/' + p.image
                });
            }
        }

       console.log(req.session.cart);
        req.flash('success', 'Product added!');
        res.redirect('back');
    });

});

/*
 * GET checkout page
 */
router.get('/checkout', isUser, function (req, res) {

    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        res.render('checkout', {
            title: 'Checkout',
            cart: req.session.cart,
            p_key: process.env.PUBLISHABLE_KEY,
            s_key: process.env.SECRET_KEY
        });
    }

});

/*
 * GET update product
 */
router.get('/update/:product', isUser, function (req, res) {

    var slug = req.params.product;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == slug) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1)
                        cart.splice(i, 1);              //removing the ith element from the cart
                    break;
                case "clear":
                    cart.splice(i, 1);                  //removing the ith element from the cart
                    if (cart.length == 0)
                        delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');

});

/*
 * GET clear cart
 */
router.get('/clear', isUser, function (req, res) {

    delete req.session.cart;
    
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');

});

/*
 * GET buy now
 */
router.get('/buynow', isUser, function (req, res) {

    delete req.session.cart;
    
    res.sendStatus(200);

});

router.get('/:slug', function(req, res){
    res.render('404.ejs');
});

// Exports
module.exports = router;


