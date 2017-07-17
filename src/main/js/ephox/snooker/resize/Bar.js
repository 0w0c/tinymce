define(
  'ephox.snooker.resize.Bar',

  [
    'ephox.syrup.api.Attr',
    'ephox.syrup.api.Css',
    'ephox.syrup.api.Element'
  ],

  function (Attr, Css, Element) {
    var col = function (column, x, y, w, h) {
      var blocker = Element.fromTag('div');
      Css.setAll(blocker, {
        position: 'absolute',
        left: x - w/2 + 'px',
        top: y + 'px',
        height: h + 'px',
        width: w + 'px'
      });

      Attr.set(blocker, 'data-column', column);
      return blocker;
    };

    var row = function (row, x, y, w, h) {
      var blocker = Element.fromTag('div');
      Css.setAll(blocker, {
        position: 'absolute',
        left: x + 'px',
        top: y - h/2 + 'px',
        height: h + 'px',
        width: w + 'px'
      });

      Attr.set(blocker, 'data-row', row);
      return blocker;
    };


    return {
      col: col,
      row: row
    };
  }
);
