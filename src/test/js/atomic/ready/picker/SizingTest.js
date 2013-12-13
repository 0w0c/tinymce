test(
  'SizingTest',

  [
    'ephox.snooker.ready.data.Structs',
    'ephox.snooker.ready.picker.Sizing'
  ],

  function (Structs, Sizing) {
    var check = function (selRow, selCol, fullRow, fullCol, address, settings) {
      var actual = Sizing.resize(address, settings);
      assert.eq(selRow, actual.selection().row());
      assert.eq(selCol, actual.selection().column());
      assert.eq(fullRow, actual.full().row());
      assert.eq(fullCol, actual.full().column());
    };

    check(1, 1, 2, 2, Structs.address(0, 0), { minCols: 1, maxCols: 5, minRows: 1, maxRows: 5 });

  }
);
