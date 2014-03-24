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
      //months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      //last = 'Last day of',
      pad = function (value, padder, digits) {
        var str = value + '';
        padder = padder || '0';
        digits = digits || 2;
        while (digits > str.length) {
          str = padder + str;
        }
        return str;
      },
      humanTime = function (time) {
        return pad(time[0]) + ':' + pad(time[1]) + (time[2] === 0 ? '' : ':' + pad(time[2]));
      },
      dateToTime = function (date) {
        var jsdate = new Date(date);
        return [jsdate.getHours(), jsdate.getMinutes(), jsdate.getSeconds()];
      },
      compareTime = function (a, b) {
        return (a[0]-b[0]) * 3600 + (a[1]-b[1]) * 60 + (a[2]-b[2]);
      },
      handlers = {
        none: function () { return true; },
        daily: function (recurrence, now) {
          var nowTime = dateToTime(now);
          return ((!recurrence.startTime || compareTime(recurrence.startTime, nowTime) <= 0) &&
                (!recurrence.endTime || compareTime(recurrence.endTime, nowTime) >= 0));
        },
        weekly: function (recurrence, now) {
          var nowDate = new Date(now);
          return nowDate.getDay() === (recurrence.day - 1) && handlers.daily(recurrence, now);
        },
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
          return handlers[schedule.recurType].call(null, recurrence, now);
        });
      },
      isScheduled = function (schedule) {
        var t = schedule.recurType;
        return t && typeof handlers[t] === 'function';
      },
      isValid = function (schedule) {
        return (schedule.recurType === 'none' &&
            (typeof schedule.start !== 'undefined' || typeof schedule.end !== 'undefined')) ||
          (schedule.recurType !== 'none' && schedule.recurrences && schedule.recurrences.length);
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
        return 'every ' + day + ' between ' + humanTime(start) + ' and ' + humanTime(end);
      },
      humanizer = {
        none: function (schedule) {
          var str = 'Shown';
          if (schedule.start) {
            str += ' starting from ' + schedule.start;
          }
          if (schedule.end) {
            str += ' ending ' + schedule.end;
          }
          return str;
        },
        daily: function (schedule) {
          var first = schedule.recurrences[0];
          return humanizer.none(schedule) + ' ' + humanDay(first.startTime, first.endTime, 'day');
        },
        weekly: function (schedule) {
          var first = schedule.recurrences[0];
          return humanizer.none(schedule) + ' ' + humanDay(first.startTime, first.endTime, weekdays[first.day-1]);
        },
        //monthly: function () {},
        //yearly: function () {}
      },
      humanize = function (schedule) {
        if (!isScheduled(schedule)) {
          return '';
        }
        if (!isValid(schedule)) {
          return 'Invalid schedule';
        }
        return humanizer[schedule.recurType].call(null, schedule);
      };
  return {
    isActive: isActive,
    humanize: humanize
  };
});