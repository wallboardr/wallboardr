var filters = require('../unit-loader').loadSubject('app/filters');

describe('nl2br', function () {
  var nl2br = filters.nl2br();
  it('transforms newlines into br tags', function () {
    expect(nl2br('Hello\nworld')).toBe('Hello<br>world');
  });
  it('does not change strings with no newlines', function () {
    expect(nl2br('Some text  ')).toBe('Some text  ');
  })
});

describe('humanType', function () {
  var rootScope = {
    plugins: {
      map: {
        message: {humanName: 'Human Name', name: 'name'},
        teamcity: {name: 'tcname'}
      }
    }
  };
  var humanType = filters.humanType(rootScope);
  it('maps plugin types to human readable versions if available', function () {
    expect(humanType('message')).toBe('Human Name');
  });
  it('maps plugin types to basic names if not human names', function () {
    expect(humanType('teamcity')).toBe('tcname');
  });
  it('passes falsy plugins through as "Unknown"', function () {
    expect(humanType('')).toBe('Unknown');
    expect(humanType(false)).toBe('Unknown');
    expect(humanType()).toBe('Unknown');
  });
  it('passes unknown plugins through as is', function () {
    expect(humanType('09gjqaojg')).toBe('09gjqaojg');
    expect(humanType(1234)).toBe(1234);
  });
});