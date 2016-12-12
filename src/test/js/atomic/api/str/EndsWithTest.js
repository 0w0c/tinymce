test('endsWith',

  [
    'ephox.katamari.api.Strings',
    'ephox.wrap-jsverify.Jsc'
  ],

  function(Strings, Jsc) {

    function check(expected, str, suffix) {
      var actual = Strings.endsWith(str, suffix);
      assert.eq(expected, actual);
    }

    check(true, '', '');
    check(true, 'a', '');
    check(true, 'a', 'a');
    check(true, 'ab', 'b');
    check(true, 'abc', 'bc');

    check(false, '', 'a');
    check(false, 'caatatetatat', 'cat');

    Jsc.property(
      'A string added to a string (at the end) must have endsWith as true',
      Jsc.string,
      Jsc.nestring,
      function (str, contents) {
        var r = str + contents;
        return Jsc.eq(true, Strings.endsWith(r, contents));
      }
    );
  }
);

