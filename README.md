# How build project (Mac OS)

### Dependencies 
Install Node.js (I use nvm manager. I recomend it.) https://github.com/creationix/nvm

In termimal.app

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
Then re-open terminal.app    

    nvm install 6.9.2
    
Add alias for this version NODE (make it default)

    nvm alias default v6.9.2
    
Installing the necessary packages GULP.js
    
    
    npm install --global gulp-cli

### Clone project to your HDD

You can download file from Github.com  https://github.com/csscoderRU/starter-base

Open folder project in terminal.app and install dependencies

    npm install

### Main command gulp
Open folder project in terminal.app

Command to build project (minified files js and css). New files will be add to "build" folder.    
    
    gulp
 
Developing project (run local server http://localhost:1981). Any cange automatic build new version project.

    gulp dev
    
