define(
  'ephox.phoenix.extract.ExtractText',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.phoenix.extract.Extract'
  ],

  function (Arr, Fun, Extract) {
    var newline = '\n';
    var space = ' ';

    var onEmpty = function (item, universe) {
      return universe.property().name(item) === 'img' ? space : newline;
    };

    var from = function (universe, item, optimise) {
      var typed = Extract.typed(universe, item, optimise);
      return Arr.map(typed, function (t) {
        return t.fold(Fun.constant(newline), onEmpty, universe.property().getText);
      }).join('');
    };

    return {
      from: from
    };
  }
);