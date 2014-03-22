#!/bin/bash
echo Installing Wallboardr
npm install
npm install ws
cp config.template.json config.json
cp plugins.template.json plugins.json
hg clone https://bitbucket.org/colinbate/wallboardr-teamcity ./public/assets/plugins/teamcity
hg clone https://bitbucket.org/colinbate/wallboardr-octopusdeploy ./public/assets/plugins/octopus
touch node_modules/grunt-concurrent/index.js
touch node_modules/grunt-nodemon/index.js
touch node_modules/grunt-contrib-jshint/index.js