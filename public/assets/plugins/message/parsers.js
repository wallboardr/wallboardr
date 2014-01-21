define([], function () {
  'use strict';

  var tableRow = /^([^|]+)\|(.+)$/,
      listLine = /^\s*(\*|#)\s+(.+)$/,
      whitespace = /^\s*$/,
      needsFullParsing = function (input) {
        return input && (input.indexOf('|') >= 0 || input.indexOf('*') >= 0 || input.indexOf('#') >= 0);
      },
      basicParse = function (input) {
        // Good ole' insert <br> tags
        return input.replace(/\n/g, '<br>\n');
      },
      openTable = function (arr) {
        arr.push('<table><tbody>');
        return true;
      },
      closeTable = function (arr) {
        arr.push('</tbody></table>');
        return false;
      },
      openList = function (arr, result) {
        var tag = result[1] === '*' ? '<ul>' : '<ol>';
        arr.push(tag);
        return tag;
      },
      closeList = function (arr, status) {
        arr.push(status.inList.replace('<', '</'));
        return false;
      },
      addListItem = function (arr, item) {
        arr.push('<li>' + item + '</li>');
      },
      trim = function (str) {
        return str.replace(/(^\s+)|(\s+$)/g, '');
      },
      addRow = function (arr, a, b) {
        arr.push('<tr><td>' + trim(a) + '</td><td>' + trim(b) + '</td></tr>');
      },
      matchSpecial = function (line) {
        var result = tableRow.exec(line);
        if (result) {
          result.isTable = true;
        } else {
          result = listLine.exec(line);
          if (result) {
            result.isList = true;
          }
        }
        return result;
      },
      openSpecial = function (arr, result, status) {
        if (result.isTable && !status.inTable) {
          status.inTable = openTable(arr);
        } else if (result.isList && !status.inList) {
          status.inList = openList(arr, result);
        }
      },
      closeSpecial = function (arr, status) {
        if (status.inTable) {
          status.inTable = closeTable(arr);
        } else if (status.inList) {
          status.inList = closeList(arr, status);
        }
      },
      addSpecial = function (arr, result) {
        if (result.isTable) {
          return addRow(arr, result[1], result[2]);
        } else if (result.isList) {
          return addListItem(arr, result[2]);
        }
        return false;
      },
      fullParse = function (input) {
        var lines = input.split('\n'),
            output = [],
            lindex = 0,
            line, lineResult,
            status = { inTable: false, inList: false };

        for (; lindex < lines.length; lindex += 1) {
          line = lines[lindex];
          lineResult = matchSpecial(line);
          if (lineResult) {
            openSpecial(output, lineResult, status);
            addSpecial(output, lineResult);
          } else if (whitespace.test(line)) {
            closeSpecial(output, status);
            output.push('<br><br>');
          } else {
            closeSpecial(output, status);
            output.push(line);
          }
        }
        closeSpecial(output, status);
        return output.join('\n');
      };

  return {
    parse: function (input) {
      var ret = [];
      if (!input) {
        return [' '];
      }
      if (needsFullParsing(input)) {
        ret.push(fullParse(input));
        ret.title = true;
      } else {
        ret.push(basicParse(input));
        ret.bigtext = true;
      }
      return ret;
    }
  };
});