let express = require('express');
let router = express.Router();
let path = require('path');

let { body, validationResult } = require('express-validator');
let Alumni = require('../models/alumni');


router.get('/form', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/alumni_form.html'));
});

router.post('/form', [

    body('firstName', 'First Name must be specified').trim().isLength({ min: 1}).escape(),
    body('lastName', 'Last Name must be specified').trim().isLength({ min: 1}).escape(),
    body('gradYear', 'Graduation Year must be specified').trim().isLength({ min: 1}).escape(),
    body('degreeType', 'Degree Type must be specified').trim().isLength({ min: 1}).escape(),
    body('occupation', 'Occupation error').trim().escape(),
    body('email', 'Email must be specified').trim().isLength({ min: 1}).escape().isEmail(),
    body('emailConfirm', 'Email confirmation must be specified').trim().isLength({ min: 1}).escape().isEmail().custom((value, { req }) => {
        if (value !== req.body.email) {
            throw new Error('Emails do not match');
        }
        return true;
    }),

 

    body('description').trim().escape(),

    (req, res, next) => {


        const errors = validationResult(req)



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
            status: 'pending'
        });

      

        if (!errors.isEmpty()) {
            // Error block
            res.status(500).send(errors.array({ onlyFirstError: true }));
        } else {
            // Success block
            Alumni.find({'email' : alumni.email, 'status': 'approved'}).exec( (err, result) => {
                if (err) {return next(err)}

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

router.get('/status', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/alumni_status.html'));
});

router.get('/mainmenu', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/alumni_options.html'));
});

router.get('/contact', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../public/contact_admin.html'));
});

function toTitleCase(text) {
    return  text.toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
}

module.exports = router;