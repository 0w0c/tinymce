define(
  'ephox.phoenix.extract.TypedList',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.phoenix.api.data.Spot',
    'ephox.polaris.api.Arrays'
  ],

  function (Arr, Fun, Option, Spot, Arrays) {
    var count = function (parray) {
      return Arr.foldr(parray, function (b, a) {
        return a.len() + b;
      }, 0);
    };

    var dropUntil = function (parray, target) {
      return Arrays.sliceby(parray, function (x) {
        return x.is(target);
      });
    };

    var gen = function (unit, start) {
      return unit.fold(Option.none, function (e) {
        return Option.some(Spot.range(e, start, start + 1));
      }, function (t) {
        return Option.some(Spot.range(t, start, start + unit.len()));
      });
    };

    var justText = function (parray) {
      return Arr.bind(parray, function (x) {
        return x.fold(Fun.constant([]), Fun.constant([]), Fun.identity);
      });
    };

    return {
      count: count,
      dropUntil: dropUntil,
      gen: gen,
      justText: justText
    };

  }
);
