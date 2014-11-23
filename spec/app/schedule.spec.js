var loader = require('../unit-loader');
var dta = require('../../public/assets/lib/datetime-arrays');

describe('The message scheduler', function () {
  var scheduler = loader.loadSubject('../plugins/message/schedule', [dta]);

  var startOnly = {start: new Date(2012, 2, 14)};
  var endOnly = {end: new Date(2014, 7, 25)};
  var rangeOnly = {
    start: new Date(2012, 2, 14),
    end: new Date(2014, 7, 25)
  };
  var recurDaily = {
    recurrences: [
      {
        day: 0,
        startTime: [7, 0, 0],
        endTime: [10, 0, 0]
      }
    ]
  };
  // beforeEach(function () {

  // });

  describe('isScheduled', function () {
    it('returns false for undefined', function () {
      expect(scheduler.isScheduled()).toBe(false);
    });

    it('returns false for false', function () {
      expect(scheduler.isScheduled(false)).toBe(false);
    });

    it('returns false for empty object', function () {
      expect(scheduler.isScheduled({})).toBe(false);
    });

    it('returns false for unknown objects', function () {
      var testObj = {hello: 'world'};
      expect(scheduler.isScheduled(testObj)).toBe(false);
    });

    it('returns false for no recurrences', function () {
      var testObj = {recurrences: []};
      expect(scheduler.isScheduled(testObj)).toBe(false);
    });

    it('returns true when start date exists', function () {
      expect(scheduler.isScheduled(startOnly)).toBe(true);
    });

    it('returns true when end date exists', function () {
      expect(scheduler.isScheduled(endOnly)).toBe(true);
    });

    it('returns true when start and end dates exist', function () {
      expect(scheduler.isScheduled(rangeOnly)).toBe(true);
    });

    it('returns true when recurrences exist', function () {
      expect(scheduler.isScheduled(recurDaily)).toBe(true);
    });
  });

  describe('humanize', function () {
    it('returns empty string for non-schedules', function () {
      expect(scheduler.humanize({})).toBe('');
    });

    it('returns invalid string for invalid schedules', function () {
      var testObj = {
        start: new Date(2013, 5, 6),
        end: new Date(2013, 3, 4)
      };
      expect(scheduler.humanize(testObj)).toBe('Invalid schedule');
    });

    it('returns appropriate string for start dates', function () {
      expect(scheduler.humanize(startOnly)).toBe('Shown starting from 2012-03-14');
    });

    it('returns appropriate string for end dates', function () {
      expect(scheduler.humanize(endOnly)).toBe('Shown ending 2014-08-25');
    });

    it('returns appropriate string for range', function () {
      expect(scheduler.humanize(rangeOnly)).toBe('Shown starting from 2012-03-14 ending 2014-08-25');
    });

    it('returns appropriate string for recurrences', function () {
      expect(scheduler.humanize(recurDaily)).toBe('Shown every day between 07:00 and 10:00');
    });
  });

  describe('isActive', function () {
    it('returns true when not scheduled', function () {
      expect(scheduler.isActive({})).toBe(true);
    });

    it('throws when not valid', function () {
      var testObj = {
        start: new Date(2013, 5, 6),
        end: new Date(2013, 3, 4)
      };
      expect(function () {scheduler.isActive(testObj)}).toThrow();
    });

    it('returns false when before start', function () {
      var current = new Date(2011, 4, 5);
      expect(scheduler.isActive(startOnly, current)).toBe(false);
    });

    it('returns false when after end', function () {
      var current = new Date(2015, 4, 5);
      expect(scheduler.isActive(endOnly, current)).toBe(false);
    });

    it('returns false when outside range', function () {
      var tooEarly = new Date(2011, 4, 5);
      var tooLate = new Date(2015, 4, 5);
      expect(scheduler.isActive(rangeOnly, tooEarly)).toBe(false);
      expect(scheduler.isActive(rangeOnly, tooLate)).toBe(false);
    });

    it('returns true when inside range', function () {
      var current = new Date(2013, 4, 5);
      expect(scheduler.isActive(rangeOnly, current)).toBe(true);
    });

    it('returns false when outside daily recurrence', function () {
      var current = new Date(2013, 4, 5, 6, 0, 0);
      expect(scheduler.isActive(recurDaily, current)).toBe(false);
    });

    it('returns true when inside daily recurrence', function () {
      var current = new Date(2013, 4, 5, 8, 0, 0);
      expect(scheduler.isActive(recurDaily, current)).toBe(true);
    });
  });

});