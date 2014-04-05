define(['lib/datetime-arrays'], function (dta) {
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
  var weekdays = ['day', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      //months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      //last = 'Last day of',
      handlers = {
        daily: function (recurrence, now) {
          var nowTime = dta.time.fromDate(now),
              dayOk = recurrence.day === 0 || now.getDay() === (recurrence.day - 1);
          return dayOk && ((!recurrence.startTime || dta.time.compare(recurrence.startTime, nowTime) <= 0) &&
                (!recurrence.endTime || dta.time.compare(recurrence.endTime, nowTime) >= 0));
        },
        route: function (recurrence, now) {
          if (!recurrence) {
            return true;
          }
          if (!recurrence.type || recurrence.type === 'daily' || recurrence.type === 'weekly') {
            return handers.daily(recurrence, now);
          }
          return false;
        }
        //monthly: function () {},
        //yearly: function () {}
      },
      isInRange = function (schedule, now) {
        return ((!schedule.start || schedule.start <= now) &&
                (!schedule.end || schedule.end >= now));
      },
      collect = function (collector, start, arr, fn) {
        var ii, ret, collected = start;
        for (ii = 0; ii < arr.length; ii += 1) {
          ret = fn.call(null, arr[ii], ii);
          collected = collector.call(null, ret, collected);
        }
        return collected;
      },
      anyTrue = function (arr, fn) {
        return collect(function (curr, prev) { return curr || prev; }, false, arr, fn);
      },
      recurrenceMet = function (schedule, now) {
        if (!schedule.recurrences || !schedule.recurrences.length) {
          return true;
        }
        return anyTrue(schedule.recurrences, function (recurrence) {
          return handlers.route.call(null, recurrence, now);
        });
      },
      isScheduled = function (schedule) {
        return schedule && ((schedule.recurrences && schedule.recurrences.length)
           || schedule.start || schedule.end);
      },
      isValid = function (schedule) {
        return true;
      },
      isActive = function (schedule, now) {
        if (!isScheduled(schedule)) {
          return true;
        }
        if (!isValid(schedule)) {
          throw 'Invalid schedule';
        }
        return isInRange(schedule, now) && recurrenceMet(schedule, now);
      },
      humanDay = function (start, end, day) {
        return ' every ' + day + ' between ' + dta.time.toString(start) + ' and ' + dta.time.toString(end);
      },
      humanizer = {
        daily: function (recurrence) {
          return humanDay(recurrence.startTime, recurrence.endTime, weekdays[recurrence.day]);
        },
        recurrence: function (recurrence) {
          if (!recurrence) {
            return '';
          }
          if (!recurrence.type || recurrence.type === 'daily' || recurrence.type === 'weekly') {
            return humanizer.daily(recurrence);
          }
          return '';
        }
        //monthly: function () {},
        //yearly: function () {}
      },
      humanize = function (schedule) {
        var str = 'Shown', ii;
        if (!isScheduled(schedule)) {
          return '';
        }
        if (!isValid(schedule)) {
          return 'Invalid schedule';
        }
        if (schedule.start) {
          str += ' starting from ' + schedule.start;
        }
        if (schedule.end) {
          str += ' ending ' + schedule.end;
        }
        if (schedule.recurrences && schedule.recurrences.length) {
          for (ii = 0; ii < schedule.recurrences.length; ii += 1) {
            str += humanizer.recurrence(schedule.recurrences[ii]);
            if (ii < schedule.recurrences.length - 1) {
              str += ' and';
            }
          }
        }
        return str;
      };
  return {
    isActive: isActive,
    humanize: humanize,
    isScheduled: isScheduled
  };
});
