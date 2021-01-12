let express = require('express');
let router = express.Router();
let path = require('path');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bodyParser = require("body-parser");
var flash = require("connect-flash");

let User = require("../models/user.model");

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');

router.use(bodyParser.urlencoded({extended : true}));

router.use(require("express-session")({ 
    secret: "EarthScience", 
    resave: false, 
    saveUninitialized: false,
})); 

router.use(flash());
router.use(passport.initialize()); 
router.use(passport.session()); 


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 

router.use((req, res, next) => {
    res.locals.errorMsg = req.flash('error');
    res.locals.error1 = req.flash('error1');
    //res.locals.user = req.user || null;
    //res.locals.currentPath = req.path;
    next();
});


router.get("/login", (req, res, next) => { 
    res.render("admin_login", {  error : req.flash('error') });

}); 

// Change Password feature is currently disabled.
router.get("/change", isLoggedIn, (req, res, next) => { 
    res.status(404);
    res.sendFile(path.join(__dirname + '/public/404.html'));
    //res.render("change_password",  {  error : req.flash('error1') });
}); 
   


router.post('/create', isLoggedIn, [

    // Data validation and sanitization
    body('firstName', 'First Name must be specified').trim().isLength({ min: 1}).escape(),
    body('lastName', 'Last Name must be specified').trim().isLength({ min: 1}).escape(),
    body('gradYear', 'Graduation Year must be specified').trim().isLength({ min: 1}).escape(),
    body('degreeType', 'Degree Type must be specified').trim().isLength({ min: 1}).escape(),
    body('occupation', 'Occupation error').trim().escape(),
    body('email', 'Email must be specified').trim().isLength({ min: 1}).escape(),
    body('email', 'Email must be valid').isEmail(),
    // TODO
   // body('email', 'email must be unique')
    body('description').trim().optional({ checkFalsy: true }).escape(),

    (req, res, next) => {
        // collect any errors
        
        const errors = validationResult(req);

        // create new alumni
        let alumni = new Alumni ({
            firstName: toTitleCase(req.body.firstName),
            lastName: toTitleCase(req.body.lastName),
            gradYear: req.body.gradYear,
            degreeType: toTitleCase(req.body.degreeType),
            occupation: req.body.occupation == '' ? 'N/A' : toTitleCase(req.body.occupation),
            email: req.body.email.toLowerCase(),
            emailList: req.body.emailList,
            description: req.body.description,
            createdDate: new Date(),
            status: 'approved'
        });

        // check for errors
        if (!errors.isEmpty()) {
            // Error block
            res.status(500).send(errors.array());
        } else {
            // Success block
            Alumni.find({'email' : alumni.email, 'status': 'approved'}).exec( (err, result) => {
                if (err) { res.send(500); }

                if (Object.keys(result).length === 0) {
                    // Email is unique
                    alumni.save(function (err) {
                        if (err) { return next(err); }
                        res.sendStatus(200);
                    });
                } else {
                    // Email already exist
                    res.status(500).send([{"value":"","msg":"Email is already in use","param":"email","location":"body"}])
                }
            });
        }
    }
]); 


router.post('/:id/update', isLoggedIn,  [

    // Data validation and sanitization
    body('firstName', 'First Name must be specified').trim().isLength({ min: 1}).escape(),
    body('lastName', 'Last Name must be specified').trim().isLength({ min: 1}).escape(),
    body('gradYear', 'Graduation Year must be specified').trim().isLength({ min: 1}).escape(),
    body('degreeType', 'Degree Type must be specified').trim().isLength({ min: 1}).escape(),
    body('occupation').trim().optional({ checkFalsy: true }).escape(),
    body('email', 'Email must be specified').trim().isLength({ min: 1}).escape(),
    body('email', 'Email must be valid').isEmail(),
    body('description').trim().optional({ checkFalsy: true }).escape(),

    (req, res, next) => {

        // collect any errors
        const errors = validationResult(req);

        // create new alumni
        let alumni = new Alumni ({
            _id: req.params.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gradYear: req.body.gradYear,
            degreeType: req.body.degreeType,
            occupation:  req.body.occupation == '' ? 'N/A' : req.body.occupation,
            email: req.body.email,
            emailList: req.body.emailList,
            description: req.body.description,
            status: 'approved'
        }); 

        // check for errors
        if (!errors.isEmpty()) {
            // Error block
            res.status(500).send(errors.array());
        } else {
            // Success block
            // instead of alumni.save use alumni.findByIDAndUpdate
            Alumni.findByIdAndUpdate(req.params.id, alumni, (err, result) => {
                    if (err) { return next(err); }
                    res.sendStatus(200);
            });
        }
    }
]);

router.post('/:id/approve', isLoggedIn, (req, res, next) => {
    Alumni.findByIdAndUpdate(req.params.id, {'status': 'approved'}, (err, result) => {
        if (err) {return next(err);}
        res.sendStatus(200);
    })
});

router.delete('/:id/delete', isLoggedIn, (req, res, next) => {
    Alumni.findByIdAndRemove(req.params.id, function deleteAlumni(err) {
        if (err) { return next(err); }
        res.sendStatus(200);
    })
})

router.get('/dashboard', isLoggedIn, (req, res, next) => {
    Alumni.find({'status': 'approved'}).exec(function(err, alumni_list) {
        if (err) {return next(err);}
        res.sendFile(path.join(__dirname + '/../public/dashboard.html'))
    })
});

router.get('/pending', isLoggedIn, (req, res, next) => {
    Alumni.find({'status': 'pending'}).exec((err, alumni_list) => {
        if (err) {return next(err);}
        res.sendFile(path.join(__dirname + '/../public/pending.html'))
    });
});  


router.post("/change", isLoggedIn, function(req, res){
    if (req.body.username === 'admin'){
        User.findById("5ff8ba6184dacc6c74573345")
          .then(foundAdmin => {
            foundAdmin.changePassword(req.body.oldpassword, req.body.newpassword)
              .then(() => {
                 res.redirect('/admin/login')
                })
              .catch((error) => {
                    req.flash('error1', 'Password or username is incorrect' )
                    res.redirect('/admin/change')
              })
         })
        }else {
            req.flash('error1', 'Password or username is incorrect' )
            res.redirect('/admin/change')
}
});

router.post('/login', passport.authenticate('local', {
    successRedirect : '/admin/dashboard',
    failureRedirect : '/admin/login',
    failureFlash : true
}));



router.get('/logout', function(req,res){
    req.logout();
    req.user = null;
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.redirect('/');
    
   });

function isLoggedIn(req, res, next) { 
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.render('admin_login.pug');  
    } 

}

function toTitleCase(text) {
    return  text.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
}

module.exports = router;

