define(['dataLoader'], function (loader) {
    'use strict';
    var apiUrl = '/httpAuth/app/rest',
        TeamCity = function (url) {
          this.baseUrl = url;
        };

    TeamCity.prototype.getProjects = function () {
      var endpoint = this.baseUrl + apiUrl + '/projects';
      return loader(endpoint);
    };

    TeamCity.prototype.getBuildConfigurations = function (proj) {
      var endpoint = this.baseUrl + proj.href;
      return loader(endpoint);
    };

    TeamCity.prototype.getBuilds = function (buildConfig, count) {
      var endpoint = this.baseUrl + buildConfig.href + '/builds?count=' + (count || 10);
      return loader(endpoint);
    };

    TeamCity.prototype.getLatestBuild = function (buildConfig) {
      var endpoint = this.baseUrl + buildConfig.href + '/builds?count=1';
      return loader(endpoint);
    };

    return function (url) {
      return new TeamCity(url);
    };
});