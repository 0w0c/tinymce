test(
  'api.PositionArray.splits',

  [
    'ephox.polaris.api.PositionArray',
    'ephox.polaris.api.Strings',
    'ephox.polaris.test.Parrays'
  ],

  function (PositionArray, Strings, Parrays) {
    var subdivide = function (unit, positions) {
      var tokens = Strings.splits(unit.item(), positions);
      return Parrays.make(tokens);
    };

    var check = function (expected, input, positions) {
      var parray = Parrays.make(input);
      var actual = PositionArray.splits(parray, positions, subdivide);
      assert.eq(expected, Parrays.dump(actual));
    };

    check([], [], []);
    check([ '0->2@ ha' ], [ 'ha' ], []);
    check([ '0->5@ hallo', '5->14@ hallobalo' ], [ 'hallo', 'hallobalo' ], []);
    check([
      '0->1@ h',
      '1->2@ a',
      '2->3@ l',
      '3->5@ lo',
      '5->6@ h',
      '6->9@ all',
      '9->11@ ob',
      '11->13@ al',
      '13->14@ o'
    ], [ 'hallo', 'hallobalo' ], [ 1, 2, 3, 6, 9, 11, 13 ]);

  }
);
