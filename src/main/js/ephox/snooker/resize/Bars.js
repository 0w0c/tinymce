define(
  'ephox.snooker.resize.Bars',

  [
    'ephox.katamari.api.Arr',
    'ephox.snooker.lookup.Blocks',
    'ephox.snooker.model.DetailsList',
    'ephox.snooker.model.Warehouse',
    'ephox.snooker.resize.Bar',
    'ephox.snooker.style.Styles',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.view.Height',
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.dom.Location',
    'ephox.sugar.api.dom.Remove',
    'ephox.sugar.api.search.SelectorFilter',
    'ephox.sugar.api.view.Width'
  ],

  function (Arr, Blocks, DetailsList, Warehouse, Bar, Styles, Class, Css, Height, Insert, Location, Remove, SelectorFilter, Width) {
    var resizeBar = Styles.resolve('resizer-bar');
    var resizeRowBar = Styles.resolve('resizer-rows');
    var resizeColBar = Styles.resolve('resizer-cols');
    var BAR_THICKNESS = 7;

    var clear = function (wire) {
      var previous = SelectorFilter.descendants(wire.parent(), '.' + resizeBar);
      Arr.each(previous, Remove.remove);
    };

    var drawBar = function (wire, positions, create) {
      var origin = wire.origin();
      Arr.each(positions, function (cpOption, i) {
        cpOption.each(function (cp) {
          var bar = create(origin, cp);
          Class.add(bar, resizeBar);
          Insert.append(wire.parent(), bar);
        });
      });
    };

    var refreshCol = function (wire, colPositions, position, tableHeight) {
      drawBar(wire, colPositions, function (origin, cp) {
        var colBar = Bar.col(cp.col(), cp.x() - origin.left(), position.top() - origin.top(), BAR_THICKNESS, tableHeight);
        Class.add(colBar, resizeColBar);
        return colBar;
      });
    };

    var refreshRow = function (wire, rowPositions, position, tableWidth) {
      drawBar(wire, rowPositions, function (origin, cp) {
        var rowBar = Bar.row(cp.row(), position.left() - origin.left(), cp.y() - origin.top(), tableWidth, BAR_THICKNESS);
        Class.add(rowBar, resizeRowBar);
        return rowBar;
      });
    };

    var refreshGrid = function (wire, table, rows, cols, hdirection, vdirection) {
      var position = Location.absolute(table);
      var rowPositions = rows.length > 0 ? hdirection.positions(rows, table) : [];
      refreshRow(wire, rowPositions, position, Width.getOuter(table));

      var colPositions = cols.length > 0 ? vdirection.positions(cols, table) : [];
      refreshCol(wire, colPositions, position, Height.getOuter(table));
    };

    var refresh = function (wire, table, hdirection, vdirection) {
      clear(wire, table);

      var list = DetailsList.fromTable(table);
      var warehouse = Warehouse.generate(list);
      var rows = Blocks.rows(warehouse);
      var cols = Blocks.columns(warehouse);

      refreshGrid(wire, table, rows, cols, hdirection, vdirection);
    };

    var each = function (wire, f) {
      var bars = SelectorFilter.descendants(wire.parent(), '.' + resizeBar);
      Arr.each(bars, f);
    };

    var hide = function (wire) {
      each(wire, function(bar) {
        Css.set(bar, 'display', 'none');
      });
    };

    var show = function (wire) {
      each(wire, function(bar) {
        Css.set(bar, 'display', 'block');
      });
    };

    var isRowBar = function (element) {
      return Class.has(element, resizeRowBar);
    };

    var isColBar = function (element) {
      return Class.has(element, resizeColBar);
    };

    return {
      refresh: refresh,
      hide: hide,
      show: show,
      destroy: clear,
      isRowBar: isRowBar,
      isColBar: isColBar
    };
  }
);
