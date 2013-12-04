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
  var humanType = filters.humanType();
  it('maps known types to human readable versions', function () {
    expect(humanType('message')).toBe('Message');
    expect(humanType('html')).toBe('Fetch HTML');
    expect(humanType('teamcity')).toBe('TeamCity');
  });
  it('maps everything else to "Unknown"', function () {
    expect(humanType('')).toBe('Unknown');
    expect(humanType('09gjqaojg')).toBe('Unknown');
    expect(humanType(1234)).toBe('Unknown');
    expect(humanType({'x': 1})).toBe('Unknown');
    expect(humanType([''])).toBe('Unknown');
  });
});