define([], function () {
  'use strict';
  var scheduleDirective = function () {

    return {
      restrict: 'A',
      scope: {
        scheduler: '=wbScheduler',
        schedule: '=wbSchedule'
      },
      templateUrl: 'assets/partial/schedule.html',
      link: function (scope) {
        scope.schedule = scope.schedule || {};
        scope.rTypes = [
          {type: 0, show: 'Daily'},
          {type: 1, show: 'Sun'},
          {type: 2, show: 'Mon'},
          {type: 3, show: 'Tue'},
          {type: 4, show: 'Wed'},
          {type: 5, show: 'Thu'},
          {type: 6, show: 'Fri'},
          {type: 7, show: 'Sat'}
        ];
        scope.editSchedule = function () {
          scope.editing = true;
        };
        scope.addNewRecurrence = function () {
          if (!scope.schedule.recurrences) {
            scope.schedule.recurrences = [];
          }
          scope.schedule.recurrences.push({day: 0, startTime: [8,30,0], endTime: [16,30,0]});
        };
      }
    };
  };
  scheduleDirective.dirName = 'wbSchedule';
  return scheduleDirective;
});
