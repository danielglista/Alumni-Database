
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/block-logo.jpg" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">Alumni Database Website for the University of Mary Washington</h3>

  <p align="center">
    <a href="https://alumni-database.herokuapp.com/">View Website</a>
</p>

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#frameworks">Frameworks</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
	<li><a href="#running-server">Running Server</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

 
 ## About the Project
 
![Home Page Image](/images/home.PNG)
 
This website was created to help the professors and faculty of Mary Washington organize and maintain their alumni list. It serves both alumni, who wish to be included in UMW's alumni list as well as faculty, who can access an administrator dashboard to manage the database. This website was built as part of a university project where students met with professors to create specific apps to fulfill their goals. I met with several UMW professors to gather requirements and stayed connected with them throughout the development process. 

## Frameworks

- [Bootstrap](https://getbootstrap.com)
- [Express](https://expressjs.com)
- [Mongoose](https://mongoosejs.com)

## Getting Started

The following instructions are for setting up and running a local instance of this repository. Click [here](https://alumni-database.herokuapp.com/) if you're looking for the live website. 

### Prerequisites

You will need to npm installed. To do so run `npm install -g npm`

### Installation

1. Clone the repo `git clone https://github.com/danielglista/Alumni-Database.git`
2. Install npm packages `npm install`

### Running Server

To start the server use `node app` or use `npm start` for live refreshing. <br>
The server will run on port 5000 by default.

*note: The credentials for the database are private, so cloned repos will not be able to access any database functionality.*

## Usage 

The alumni database website serves two users, alumni users and administrator users. <br>
Alumni users can submit a new alumni entry, check the status of an existing entry (Entries have a status of *pending* until accepted by an administrator user), and contact an administrator user. 
![Home Page Image](/images/alumni_options.PNG)
Administrator users have basic CRUD (Create, Read, Update, and Delete) functionality for alumni entries, and can accept or reject pending entries in the pending tab.
![Home Page Image](/images/dashboard.PNG)

<br>

*note: Bootstrap does not work in desktop Safari and certain functionality doesn't work on mobile Safari*

## Contact 

Daniel Glista - dnglista@gmail.com


