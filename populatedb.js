let userArgs = process.argv.slice(2);

let async = require('async');
let Alumni = require('./models/alumni.js');

let mongoose = require('mongoose');
let mongoDB = 'mongodb+srv://admin:adminPassword@cluster0.ihh2i.mongodb.net/Alumni-Database?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let alumni = [];

function alumnusCreate(firstName, lastName, gradYear, occupation, degreeType, email, emailList, description, status, callback) {
    alumniInfo = {firstName: firstName, lastName: lastName, gradYear: gradYear, occupation: occupation, degreeType: degreeType, description: description, email: email, emailList: emailList};

    let alumnus = new Alumni(alumniInfo);

    alumnus.save(function(err) {
        if (err) {
            callback(err, null);
            return;
        }
        console.log('New Alumni: ' + alumnus);
        alumni.push(alumnus)
        callback(null, alumnus);
    })
}

function createAlumniEntries(callback) {
    async.series([
    function(callback) {
        alumnusCreate('John', 'Doe', 2018, 'Research Assistant', 'Envirnmental Science', 'johndoe@email.com' , true, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Mary', 'Johnson', 2020, 'Intern', 'Physics', 'maryjohnson@email.com' , false, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Chris', 'Miller', 2020, 'Intern' , 'Computer Science', 'chrismiller@email.com' , true, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Amy', 'Smith', 2017, 'Accountant', 'Math', 'amysmith@email.com' , false, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Sam', 'Williams', 2015, 'Nurse', 'Biology', 'samwilliams@email.com' , true, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Elizebeth', 'Anderson', 2020, 'Meteorologist', 'Earth Science', 'elizebethanderson@email.com' , false, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Greg', 'Cooper', 2018, 'Social Media Manager', 'Envirnmental Science', 'aregcooper@email.com' , true, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Kelly', 'Jones', 2021, 'Student', 'English', 'kellyjones@email.com' , false, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('John', 'Lopez', 2017, 'Software Engineer', 'Computer Science', 'johnlopez@email.com' , true, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Fiona', 'Olson', 2020, 'Teacher', 'International Affairs', 'fionaolson@email.com' , false, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Chris', 'Martinez', 2003, 'Historian', 'History', 'chirsmartinez@email.com' , true, 'My name is Chirs Martinez', 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Nancy', 'Hernandez', 2020, 'Engineer', 'Engineering', 'nancyhernandez@email.com' , false, 'I like chocolate', 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Daniel', 'Lopez', 2009, 'Account Manager', 'Greek', 'daniellopez@email.com' , true, 'This is a description', 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Lisa', 'Wilson', 2011, 'Administrative Assistant', 'Psychology', 'lisawilson@email.com' , false, 'What is this? A database for ants!?', 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Matthew', 'Anderson', 2017, 'Salesperson', 'Communication', 'mattanderson@email.com' , false, '28-3', 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Margaret', 'Thomas', 2019, 'Journalist', 'Journalism', 'margeratthomas@email.com' , true, 'Lorem Ipsum', 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Anthony', 'Taylor', 2016, 'Dancer', 'Performing Arts', 'anthonytaylor@email.com' , false, "If your reading this, I'm writing this while watching the Alabama-Ohio State game.", 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Betty', 'Moore', 2020, 'Graphic Designer', 'Visual Arts', 'bettymoore@email.com' , true, 'Words Words Words Words Words.', 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Donald', 'Jackson', 2015, 'Teacher', 'Education', 'donaldjackson@email.com' , false, '', 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Sandra', 'Martin', 2020, 'Software Engineer', 'Computer Science', 'sandramartin@email.com' , true, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Mark', 'Lee', 2012, 'Business Things', 'Business', 'marklee@email.com' , false, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Ashley', 'Perez', 2009, 'Teacher', 'History', 'ashleyperez@email.com' , true, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Paul', 'Thompson', 2014, 'Architect', 'Architecture', 'paulthompson@email.com' , false, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Kimberly', 'White', 2018, 'Chemist', 'Chemistry', 'kimberlywhite@email.com' , true, null, 'pending', callback);
    },
    function(callback) {
        alumnusCreate('Steven', 'Harris', 2019, 'Financial Analyst', 'Economics', 'stevenharris@email.com' , false, null, 'pending', callback);
    },
    ],
    callback
    );
}

async.series([
    createAlumniEntries
],
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    mongoose.connection.close();
});