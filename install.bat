@echo off
echo Installing Wallboardr
npm install
npm install ws
hg clone https://bitbucket.org/colinbate/wallboardr-teamcity ./public/assets/plugins/teamcity
hg clone https://bitbucket.org/colinbate/wallboardr-octopusdeploy ./public/assets/plugins/octopus
copy /y NUL node_modules/grunt-concurrent/index.js >NUL
copy /y NUL node_modules/grunt-nodemon/index.js >NUL
copy /y NUL node_modules/grunt-contrib-jshint/index.js >NUL
copy /y NUL node_modules/grunt-contrib-less/index.js >NUL
