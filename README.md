Alumni Database for the University of Mary Washington
<br>
[View Website](https://alumni-database.herokuapp.com/)

<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Best-README-Template</h3>

  <p align="center">
    An awesome README template to jumpstart your projects!
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a>
  </p>
</p>

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#framworks">Frameworks</a></li>
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
 
![Home Page Image](/screenshots/home.PNG)
 
This website was created to help the professors and factulty of Mary Washington organize and maintain their alumni list. It serves both alumni, who wish to be including in UMW's alumni list as well as faculty, who can access an administrator dashboard to manage the database. This website was built as part of a university project where students met with professors to create specific apps to fufil their goals. I met with several UMW professors to gather requirements and stayed connected with them throughout the development process. 

## Frameworks

- [Bootstrap](https://getbootstrap.com)
- [Express](https://expressjs.com)
- [Mongoose](https://expressjs.com)

## Getting Started

The following instruction are for setting up and running a local instance of this repository. Click [here](https://alumni-database.herokuapp.com/) if your looking for the live website. 

### Prerequisites

You will need to npm installed. To do so run `npm install -g npm`

### Installation

1. Clone the repo `git clone https://github.com/danielglista/Alumni-Database.git`
2. Install npm packages `npm install`

### Running Server

To start the server use `node app` or use `npm start` for live refreshing.

*note: The credentials for the database are private, so cloned repos will not be able to access any database functionality.*

## Usage 

The alumni database website serves two users, alumni users and administrator users. <br>
Alumni users can submit a new alumni entry, check the status of an existing entry (Entries have a status of *pending* untill accepted by an administrator user), and contact an administrator user. 
![Home Page Image](/screenshots/alumni_options.PNG)
Administrator users can accept or reject pending entries have basic CRUD (Create, Read, Update, and Delete) functionality alumni entries, and can accept or reject pending entries in the pending tab.
![Home Page Image](/screenshots/dashboard.PNG)

## Contact 

Daniel Glista - dnglista@gmail.com
