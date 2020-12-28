let express = require('express');
let router = express.Router();
let path = require('path');

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');


router.get('/form', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/alumni_create.html'));
});

router.post('/form', [

    body('firstName', 'First Name must be specified').trim().isLength({ min: 1}).escape(),
    body('lastName', 'Last Name must be specified').trim().isLength({ min: 1}).escape(),
    body('gradYear', 'Graduation Year must be specified').trim().isLength({ min: 1}).escape(),
    body('degreeType', 'Degree Type must be specified').trim().isLength({ min: 1}).escape(),
    body('occupation', 'Occupation error').trim().escape(),
    body('email', 'Email must be specified').trim().isLength({ min: 1}).escape().isEmail(),
    body('emailConfirm').trim().isLength({ min: 1}).escape().isEmail().custom((value, { req }) => {
        if (value !== req.body.email) {
            throw new Error('Emails do not match');
        }
        return true;
    }),
    body('description').trim().escape(),
    body('emailList'),

    (req, res, next) => {

        console.log(req.body.emailConfirm)
        const errors = validationResult(req);

        let alumni = new Alumni ({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            gradYear: req.body.gradYear,
            degreeType: req.body.degreeType,
            occupation: req.body.occupation == '' ? 'N/A' : req.body.occupation,
            email: req.body.email,
            emailList: req.body.emailList == 'on' ? true : false,
            description: req.body.description,
            createdDate: new Date(),
            status: 'pending'
        });

      

        if (!errors.isEmpty()) {
            // Error block
            res.status(500).send(errors.array());
        } else {
            // Success block
            Alumni.find({'email' : alumni.email, 'status': 'approved'}).exec( (err, result) => {
                if (err) {return next(err)}
                console.log(result)
                if (Object.keys(result).length === 0) {
                    // Email is unique
                    alumni.save(function (err) {
                        if (err) { return next(err); }
                        res.sendFile(path.join(__dirname + '/../public/alumni_create_success.html'));
                    });
                } else {
                    // Email already exist

                    res.status(500).sendFile(path.join(__dirname + '/../public/alumni_create.html'));
                }
            });
           
        }
    }
]); 

router.get('/status', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/alumni_status.html'));
});

router.get('/mainmenu', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/alumni_options.html'));
});

router.get('/contact', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/contact_admin.html'));
});
module.exports = router;