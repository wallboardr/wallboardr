
//require(['app/filters'], function (filters) {
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
//});