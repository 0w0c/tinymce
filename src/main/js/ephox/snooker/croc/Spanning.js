define(
  'ephox.snooker.croc.Spanning',

  [
    'ephox.scullion.Struct'
  ],

  function (Struct) {
    return Struct.immutable('rowspan', 'colspan');
  }
);
