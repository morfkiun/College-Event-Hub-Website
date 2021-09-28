Make sure IDE used is Visual Studio Code and npm for Javascript is installed already.
Use Microsoft SQL Server and use the settings in 'database_setup.sql' to set up database.
Open 'CollegeWebsiteDB' folder in VS Code and open 'index.js' and run the file using Node.js
and go to localhost:5000 on the web browser to go to web application login screen

Project assumes name of database server is 'ME-BUILD\SQLEXPRESS' and uses Windows authentication
to access it.

if project does not run, open VSCODE, install npm. Follow instructions up to step 5 under
'Using NPM' in this website: https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/development_environment

then move all files in CollegeWebsiteDB, except for folder 'node_modules' and the 2 json files,
into the new directory then use the command 'npm install' in the VS CODE terminal to install
express, body-parser, path, and process if it has not been installed already
