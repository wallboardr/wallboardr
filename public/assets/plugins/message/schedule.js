define([], function () {
  'use strict';
  /* Scheduling logic */
  
  /* Example schedule:
     var s = {
       recurType: 'none | daily | weekly | monthly | yearly',
       recurrences: [
         { startTime: Time, endTime: Time }, // daily
         { day: Weekday, startTime: Time, endTime: Time }, // weekly
         { day: DayOfMonth, startTime: Time, endTime: Time }, // monthly
         { month: Month, day: DayOfMonth, startTime: Time, endTime: Time }, // yearly
       ],
       start: DateTime,
       end: DateTime
     };
     Time := [Hour, Min, Second]
     Hour := 0..23
     Min := 0..59
     Second := 0..59
     Weekday := 1..7
     Week := 1..4 | -1..-4
     DayOfMonth := 1..31 | -1 | 'Week/Weekday'
     Month := 1..12
     DateTime := JS timestamp
  */
  var weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      last = 'Last day of',
      isInRange = function (schedule, now) {
        return ((!schedule.start || schedule.start <= now) &&
                (!schedule.end || schedule.end >= now));
      },
      isValid = function (schedule) {
        return (typeof schedule.recurType === 'undefined') ||
          (schedule.recurType === 'none' &&
            (typeof schedule.start !== 'undefined' || typeof schedule.end !== 'undefined')) ||
          (schedule.recurType !== 'none' && schedule.recurrences && schedule.recurrences.length)
      },
      isActive = function (schedule, now) {
        if (!isValid(schedule)) {
          throw 'Invalid schedule';
        }
        return isInRange(schedule, now);
      },
      humanize = function (schedule) {
        
      };
  return {
    isActive: isActive,
    humanize: humanize
  };
});