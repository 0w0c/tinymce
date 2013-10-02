test(
  'CurrentWordTest',

  [
    'ephox.perhaps.Option',
    'ephox.robin.test.Assertions',
    'ephox.robin.util.CurrentWord'
  ],

  function (Option, Assertions, CurrentWord) {
    var check = function (expected, text, position) {
      var actual = CurrentWord.around(text, position);
      Assertions.assertOpt(expected.before, actual.before());
      Assertions.assertOpt(expected.after, actual.after());
    };

    check({ before: Option.some(' this is a '.length), after: Option.some(' this is a test'.length) },
      ' this is a test case', ' this is a t'.length);
    check({ before: Option.some(' this is a test '.length), after: Option.none() },
      ' this is a test case', ' this is a test ca'.length);

    check({ before: Option.some(' this is a test'.length), after: Option.some(' this is a test'.length) },
      ' this is a test case', ' this is a test'.length);
    check({ before: Option.some(' this is a test '.length), after: Option.none() },
      ' this is a test case', ' this is a test case'.length);
    check({ before: Option.some(16), after: Option.none() }, ' this is a test case', ' this is a test ca'.length);
  }
);
