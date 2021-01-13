Alumni Database for the University of Mary Washington
<br>
	[View Website](https://www.alumni-database.herokuapp.com)
 
 ## About the Project
 
This website was created to help the professors and factulty of Mary Washington organize and maintain their alumni list. It allows alumni to enter their own data into the database and to opt into an email list. It also gives an administrator a dashboard with CRUD (create, read, update, delete) functionality.

## Frameworks

- [Bootstrap](https://getbootstrap.com)
- [Express](https://expressjs.com)
- [Mongoose](https://expressjs.com)

## Getting Started

The following instruction are for setting up and running a local instance of this repository. Click <here> if your looking for the live website. 

### Prerequisites

You will need to npm installed. To do so run `npm install -g npm`

### Installation

1. Clone the repo `git clone https://github.com/danielglista/Alumni-Database.git`
2. Install npm packages `npm install`

### Running Server

To start the server use `node app` or use `npm start` for live refreshing.

*note: The credentials for the database are private, so cloned repos will not be able to access any database functionality.*

## Usage 

The alumni database website serves two users, alumni users and administrator users. Alumni users can submit a new alumni entry, check the status of an existing entry (Entries have a status of *pending* untill accepted by an administrator user), and contact an administrator user. Administrator users can accept or reject pending entries and have basic CRUD (Create, Read, Update, and Delete) functionality of accepted entries. 

## Contact 

Daniel Glista - dnglista@gmail.com
