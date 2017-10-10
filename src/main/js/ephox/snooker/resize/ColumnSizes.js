define(
  'ephox.snooker.resize.ColumnSizes',

  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.snooker.lookup.Blocks',
    'ephox.snooker.resize.Sizes',
    'ephox.snooker.util.CellUtils',
    'ephox.snooker.util.Util',
    'ephox.sugar.api.properties.Css'
  ],

  function (Arr, Fun, Blocks, Sizes, CellUtils, Util, Css) {
    var getRaw = function (cell, property, getter) {
      return Css.getRaw(cell, property).fold(function () {
        return getter(cell) + 'px';
      }, function (raw) {
        return raw;
      });
    };

    var getRawW = function (cell) {
      return getRaw(cell, 'width', Sizes.getPixelWidth);
    };

    var getRawH = function (cell) {
      return getRaw(cell, 'height', Sizes.getHeight);
    };

    var getPixelsW = function (cell) {
      return Sizes.getPixelWidth(cell);
    };

    var getWidthFrom = function (warehouse, direction, getWidth, fallback, tableSize) {
      var columns = Blocks.columns(warehouse);

      var backups = Arr.map(columns, function (cellOption) {
        return cellOption.map(direction.edge);
      });

      return Arr.map(columns, function (cellOption, c) {
        // Only use the width of cells that have no column span (or colspan 1)
        var columnCell = cellOption.filter(Fun.not(CellUtils.hasColspan));
        return columnCell.fold(function () {
          // Can't just read the width of a cell, so calculate.
          var deduced = Util.deduce(backups, c);
          return fallback(deduced);
        }, function (cell) {
          return getWidth(cell, tableSize);
        });
      });
    };

    var getDeduced = function (deduced) {
      return deduced.map(function (d) { return d + 'px'; }).getOr('');
    };

    var getRawWidths = function (warehouse, direction) {
      return getWidthFrom(warehouse, direction, getRawW, getDeduced);
    };

    var getPercentageWidths = function (warehouse, direction, tableSize) {
      return getWidthFrom(warehouse, direction, Sizes.getPercentageWidth, function (deduced) {
        return deduced.fold(function () {
          return tableSize.minCellWidth();
        }, function (cellWidth) {
          return cellWidth / tableSize.pixelWidth() * 100;
        });
      }, tableSize);
    };

    var getPixelWidths = function (warehouse, direction, tableSize) {
      return getWidthFrom(warehouse, direction, getPixelsW, function (deduced) {
        // Minimum cell width when all else fails.
        return deduced.getOrThunk(tableSize.minCellWidth);
      }, tableSize);
    };

    var getPixelsH = function (cell) {
      return Sizes.getHeight(cell);
    };

    var getHeightFrom = function (warehouse, direction, getHeight, fallback) {
      var rows = Blocks.rows(warehouse);

      var backups = Arr.map(rows, function (cellOption) {
        return cellOption.map(direction.edge);
      });

      return Arr.map(rows, function (cellOption, c) {
        var rowCell = cellOption.filter(Fun.not(CellUtils.hasRowspan));

        return rowCell.fold(function () {
          var deduced = Util.deduce(backups, c);
          return fallback(deduced);
        }, function (cell) {
          return getHeight(cell);
        });
      });
    };

    var getPixelHeights = function (warehouse, direction) {
      return getHeightFrom(warehouse, direction, getPixelsH, function (deduced) {
        return deduced.getOrThunk(CellUtils.minHeight);
      });
    };

    var getRawHeights = function (warehouse, direction) {
      return getHeightFrom(warehouse, direction, getRawH, getDeduced);
    };

    return {
      getRawWidths: getRawWidths,
      getPixelWidths: getPixelWidths,
      getPercentageWidths: getPercentageWidths,
      getPixelHeights: getPixelHeights,
      getRawHeights: getRawHeights
    };
  }
);