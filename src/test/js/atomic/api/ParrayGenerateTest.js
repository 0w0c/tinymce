test(
  'api.PositionArray.generate',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.polaris.api.PositionArray'
  ],

  function (Arr, Fun, Option, PositionArray) {
    var generator = function (item, start) {
      var firstletter = item[0];
      if (firstletter === 'a') return Option.none();
      return Option.some({
        start: Fun.constant(start),
        finish: Fun.constant(start + item.length),
        item: Fun.constant(item)
      });
    };

    var check = function (expected, input, _start) {
      var result = PositionArray.generate(input, generator, _start);
      assert.eq(expected, Arr.map(result, function (item) {
        return item.start() + '->' + item.finish() + '@ ' + item.item();
      }));
    };

    check([
      '0->3@ cat',
      '3->6@ dog',
      '6->11@ mogel',
      '11->11@ ',
      '11->13@ hi'
    ], [ 'cat', 'dog', 'ab', 'mogel', '', 'hi' ]);

    check([
      '10->13@ cat',
      '13->16@ dog',
      '16->21@ mogel',
      '21->21@ ',
      '21->23@ hi'
    ], [ 'cat', 'dog', 'ab', 'mogel', '', 'hi' ], 10);
  }
);
