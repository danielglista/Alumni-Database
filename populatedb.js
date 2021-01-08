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