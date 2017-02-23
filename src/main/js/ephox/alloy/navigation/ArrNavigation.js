define(
  'ephox.alloy.navigation.ArrNavigation',

  [
    'ephox.katamari.api.Arr',
    'global!Math'
  ],

  function (Arr, Math) {
    var cyclePrev = function (values, index, predicate) {
      var before = Arr.reverse(values.slice(0, index));
      var after = Arr.reverse(values.slice(index + 1));
      return Arr.find(before.concat(after), predicate);
    };

    var tryPrev = function (values, index, predicate) {
      var before = Arr.reverse(values.slice(0, index));
      return Arr.find(before, predicate);
    };

    var cycleNext = function (values, index, predicate) {
      var before = values.slice(0, index);
      var after = values.slice(index + 1);
      return Arr.find(after.concat(before), predicate);
    };

    var tryNext = function (values, index, predicate) {
      var after = values.slice(index + 1);
      return Arr.find(after, predicate);
    };

    return {
      cyclePrev: cyclePrev,
      cycleNext: cycleNext,
      tryPrev: tryPrev,
      tryNext: tryNext
    };
  }
);