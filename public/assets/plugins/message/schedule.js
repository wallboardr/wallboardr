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
});