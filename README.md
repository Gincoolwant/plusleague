# <div align='center'>🏀 <a href="https://plusleague.herokuapp.com/">P+報哩災(P+ Schedule Explorer)</a></div>
<div align='center'>
<p>
    <a href="https://plusleague.herokuapp.com/"><img src="https://www.herokucdn.com/deploy/button.svg"/></a>
<p>
    <a href="https://plusleague.herokuapp.com/"><img src="https://img.shields.io/website-up-down-green-red/http/monip.org.svg"/></a>
    <img src="https://img.shields.io/badge/Node.js-v14.16.0-green"/>
</p>
</div>
<p>
P+ Schedule Explorer allows users to quickly query schedule information based on specified conditions and seamlessly add events to their personal Google Calendar.

A full-fledged application featuring user registration and login systems. The frontend is built with HTML and Bootstrap using the Handlebars view engine. The backend server is powered by Node.js and Express.js, with MySQL as the database for matches and users information. The application is deployed on Heroku.
</p>

![cover](./public/README-images/cover.png)

![calendar](./public/README-images/project_plusleague.gif)

<p><strong><a href="https://plusleague.herokuapp.com/">
Click here for Live demo</a></strong>
</p>

| Role | Account | Password |
| :----:| :----: | :----: |
| User | user1@example.com | 123 |
| Admin | admin@example.com | 123 |

**For demo convenience, the user account are linked to specific Google accounts. To use the Google Calendar service, please register a new account and authorize OAuth2.0.**

## 📕 How to Use the App
1. Sign Up / Log In:  
If you're a new user, sign up with your email and password.  
If you're a returning user, log in with your credentials.

2. Find the Match:  
Navigate to the app's home page.
Browse or search for the desired match.

3. Add to Calendar:  
Click on the match you're interested in.
Look for the "加入行事曆" (Add to Calendar) button.

4. Google OAuth2.0 Authorize:  
You will be prompted to log in to your Google account for authorization. Authorize the app to access your Google Calendar.

5. Added Events to Your Google Calendar:  
Once authorized, the selected match will be added to your personal Google Calendar.

## 🌟Features
### Schedule Source
+ Utilizes Axios and Cheerio for web scraping from the Plus League official website.
### Login and Registration
+ User registration and login functionality with flash message error prompts.
+ Secure password storage using bcrypt.
+ Passport.js implementation for login authentication.
+ Supporting JWT authentication.
### User Privileges 
+ Filter matches by month, team, or venue.
+ Added Matches as events to Your Google/IOS Calendar.
+ Customize the user name and avatar.
### Admin Privileges
+ Capability to list or delist schedules.
+ Viewing a list of all registered users.

## ⚙️Install
### 1. Quick start - Docker compose
1. Quick start by docker compose
If you want to use the following command line to quick start, you have to install ![Docker](https://www.docker.com/)
```zsh
$ docker compose up
```
2. Close docker compose
```zsh
$ docker compose down
```
### 2. Clone the repository
```zsh
$ git clone https://github.com/Gincoolwant/plusleague.git

# Go into the repository
$ cd plusleague

# Remove current origin repository
$ git remote remove origin
```

### Install dependencies
```zsh
$ npm install
```
### Configuration
Locate the .env example file and rename it to .env.  
Complete all the environment variables in the .env file.
```yml
PORT = #local port allowed, default:3000
SESSION_SECRET = #session secret for passport(local) authenticate
JWT_SECRET = #your jwt secret for passport(jwt) authenticate

GOOGLE_CLIENT_ID = #your google api client id
GOOGLE_CLIENT_SECRET = #your google api client secret
GOOGLE_REDIRECT_URL = #google oauth2 redirect url

MYSQL_USERNAME = #your mysql username
MYSQL_PASSWORD = #your mysql password
MYSQL_DATABASE = #database name of mysql

REDIS_URL = # redis url

IMGUR_CLIENT_ID= #Input your Imgur CLIENT ID
IMGUR_CLIENT_SECRET = #Input your Imgur CLIENT SECRET
IMGUR_REFRESH_TOKEN = #Input your Imgur REFRESH TOKEN
```

### Setup DB
In MySQL Workbench, create a database naming the exactly name in .env file.

```sql
CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}; 
```

### Data migration
Creating tables in DB depends on migration files through Sequelize.

```
npx sequelize db:migrate
```

### Create seeders
Establishing seeders.

```zsh
$ npx sequelize db:seed:all
```

### Start server
Run server on localhost.

```zsh
$ npm run start
```
When the app is successfully connected, you will see the message: App is listening on port 3000!. Open your browser and enter the URL http://localhost:3000. It is running successfully on your localhost.

### Stop server
Pressing Ctrl + C twice stopping server.

### Web Scraping
How to scrap the new season matches?  
Taking 2023-2024 regular season for example.

1. Scraping form the official page
```zsh
node ./crawler/src/crawler.js 2023 plg-regular 'https://pleagueofficial.com/schedule-regular-season/2023-24'

# node ./crawler/src/crawler.js ${arg0} ${arg1} ${arg2}
# arg0 = ${starting_year} ex: 2023
# arg1 = ${matches_type} ex: plg-regular
# arg2 = ${url} ex: 'https://pleagueofficial.com/schedule-regular-season/2023-24'
```
2. Creating new seeder file.
```zsh
npx sequelize db:seed:generate --name regular23-24-seed-file
```
You will get a new seeder file.  
(ex: 20231108065559-regular23-24-seed-file)
Refering to the other files, complete the seed file.

3. Inserting the seeder to DB.
```zsh
npx sequelize db:seed --seed 20231108065559-regular23-24-seed-file
```

4. You are ready to go!

## 🛠️ Technologies
<div>
<img src="https://img.shields.io/badge/javascript%20-%23323330.svg?&style=for-the-badge&logo=javascript&logoColor=%23F7DF1E"/>
<img src="https://img.shields.io/badge/html5%20-%23E34F26.svg?&style=for-the-badge&logo=html5&logoColor=white"/>
<img src="https://img.shields.io/badge/css3%20-%231572B6.svg?&style=for-the-badge&logo=css3&logoColor=white"/>
<img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white">
</div>
<div>
<img src="https://img.shields.io/badge/node.js%20-%2343853D.svg?&style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge"/>
<img src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white"/>
<img src="https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white"/>
</div>
<img src="https://img.shields.io/badge/Visual_Studio_Code-0078D4?style=for-the-badge&logo=visual%20studio%20code&logoColor=white"/>
</div>

Source
+ [Plus League Official](https://pleagueofficial.com/)

NPM Packages
+ [Express](https://www.npmjs.com/package/express) - web framework for node.js
+ [Express-Handlebars](https://www.npmjs.com/package/express-handlebars) - view engine for Express
+ [passport](https://www.npmjs.com/package/passport) - authentication middleware for Node.js.
+ [Sequelize](https://sequelize.org/) - ORM for SQL query builder
+ [googleapis](https://www.npmjs.com/package/googleapis) - Node.js client library for using Google APIs. Support for authorization and authentication with OAuth 2.0, API Keys and JWT tokens is included.
+ [redis](https://www.npmjs.com/package/redis) - Redis client for Node.js.
+ [bcryptjs](https://www.npmjs.com/package/bcryptjs) - store hashed password in the database
+ [dayjs](https://day.js.org/en/) - JavaScript library that parses, validates, manipulates, and displays dates and times.

## 🖥️Contributor
+ [CK](https://github.com/Gincoolwant)
+ email: soulbox790326@gmail.com

## 📚 License

<img src="https://img.shields.io/github/license/clairepeng0808/smart-brain-app?style=flat-square&color=9cf" />
