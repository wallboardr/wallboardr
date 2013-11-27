define([], function () {
    'use strict';
    var apiUrl = '/httpAuth/app/rest',
        TeamCity = function (url, loader) {
          this.baseUrl = url;
          this.loader = loader;
        },
        load = function (url, filter) {
          return this.loader({
            url: url,
            filter: filter,
            proxy: true
          });
        },
        getBuildsHref = function (buildConfigOrId) {
          if (buildConfigOrId && buildConfigOrId.href) {
            return buildConfigOrId.href;
          }
          return apiUrl + '/buildTypes/id:' + buildConfigOrId;
        },
        filterBuildConfigurations,
        filterBuilds,
        filterLatestBuild;

    TeamCity.prototype.getProjects = function () {
      var endpoint = this.baseUrl + apiUrl + '/projects';
      return load.call(this, endpoint);
    };

    filterBuildConfigurations = function (data) {
      return data && data.buildTypes && data.buildTypes.buildType;
    };
    TeamCity.prototype.getBuildConfigurations = function (proj) {
      var endpoint = this.baseUrl + proj.href;
      return load.call(this, endpoint, filterBuildConfigurations);
    };

    filterBuilds = function (data) {
      return data && data.build;
    };
    TeamCity.prototype.getBuilds = function (buildConfigOrId, count) {
      var endpoint = this.baseUrl + getBuildsHref(buildConfigOrId) + '/builds?count=' + (count || 10);
      return load.call(this, endpoint, filterBuilds);
    };

    filterLatestBuild = function (data) {
      return data && data.build && data.build[0];
    };
    TeamCity.prototype.getLatestBuild = function (buildConfigOrId) {
      var endpoint = this.baseUrl + getBuildsHref(buildConfigOrId) + '/builds?count=1';
      return load.call(this, endpoint, filterLatestBuild);
    };

    return function (url, loader) {
      return new TeamCity(url, loader);
    };
});