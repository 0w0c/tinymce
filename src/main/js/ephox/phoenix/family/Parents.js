define(
  'ephox.phoenix.family.Parents',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Option'
  ],

  function (Arr, Option) {
    /**
     * Search the parents of both items for a common element
     */
    var common = function (universe, item1, item2) {
      var item1parents = [item1].concat(universe.up().all(item1));
      var item2parents = [item2].concat(universe.up().all(item2));

      var r = Arr.find(item1parents, function (x) {
        return Arr.exists(item2parents, function (y) {
          return universe.eq(y, x);
        });
      });

      return Option.from(r);
    };

    return {
      common: common
    };

  }
);
