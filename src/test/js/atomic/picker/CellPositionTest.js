test(
  'CellPositionTest',

  [
    'ephox.snooker.api.Structs',
    'ephox.snooker.picker.CellPosition'
  ],

  function (Structs, CellPosition) {
   var check = function (expected, posX, posY, width, height, rows, cols, x, y) {
    var position = Structs.coords(posX, posY);
    var dimensions = Structs.dimensions(width, height);
    var grid = Structs.grid(rows, cols);
    var mouse = Structs.coords(x, y);
    var actual = CellPosition.findCell(position, dimensions, grid, mouse);
    assert.eq(expected.col, actual.column());
    assert.eq(expected.row, actual.row());
   };

   check({row:0, col:0}, 0, 0, 500, 500, 10, 10, 0, 0);
   check({row:2, col:2}, 0, 0, 500, 500, 10, 10, 110, 100);
   check({row:0, col:2}, 0, 0, 500, 500, 10, 10, 110, 10);
   check({row:2, col:1}, 0, 0, 300, 1000, 10, 5, 110, 210);
   check({row:0, col:1}, 50, 180, 300, 1000, 10, 5, 110, 210);
  }
);
