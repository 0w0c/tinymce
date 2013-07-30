define(
  'ephox.snooker.croc.Bison',

  [
    'ephox.compass.Arr',
    'ephox.compass.Obj',
    'ephox.highway.Merger',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.scullion.Struct',
    'ephox.snooker.croc.Spanning',
    'ephox.snooker.util.Util'
  ],

  function (Arr, Obj, Merger, Fun, Option, Struct, Spanning, Util) {

    var getId = function (r, c) {
      return r + ',' + c;
    };

    var stomp = function (input) {
      var result = {};
      Arr.each(input, function (row, r) {
        Arr.each(row, function (cell) {
          var start = 0;
          while (result[getId(r, start)] !== undefined) {
            start++;
          }

          for (var i = 0; i < cell.colspan(); i++) {
            for (var j = 0; j < cell.rowspan(); j++) {
              var newpos = getId(r + j, start + i);
              result[newpos] = {
                row: Fun.constant(r),
                column: Fun.constant(start),
                id: cell.id,
                colspan: cell.colspan,
                rowspan: cell.rowspan
              };
            }
          }
        });
      });

      return result;
    };

    var blecker = function (worm, row, rowId, column) {
      /* Generates a list of cells before this column */
      var r = [];
      for (var i = 0; i < column; i++) {
        var position = getId(rowId, i);
        var w = worm[position];
        if (r.length === 0 || r[r.length - 1].id() !== w.id()) {
          if (w.column() + w.colspan() <= column && w.column() !== column && w.column() === i && w.row() === rowId) r.push(w);
        }
      }
      return r;
    };


    var decker = function (worm, row, rowId, column) {
      var r = [];
      for (var i = column + 1; i < 7; i++) {
        var position = getId(rowId, i);
        var w = worm[position];
        if (w !== undefined && (r.length === 0 || r[r.length - 1].id() !== w.id())) {
          if (w.column() !== column && w.column() === i && w.row() === rowId) r.push(w);
        }
      }
      return r;
      /* Generates a list of cells after this column */
    };

    var max = Struct.immutable('before', 'on', 'after');

    var voom = function (input, c) {
      var worm = stomp(input);

      var result = [];
      Arr.each(input, function (row, r) {
        var position = getId(r, c);
        var cell = worm[position];
        var before = blecker(worm, row, r, c);
        var after = decker(worm, row, r, c);
        if (cell.row() === r) {
          result.push(max(before, Option.some(cell), after));
        } else {
          result.push(max(before, Option.none(), after));
        }
      });

      return result;
    };

    var tacky = function (worm, id) {
      var values = Obj.values(worm);
      return Arr.find(values, function (x) {
        return x.id() === id;
      });
    };

    var single = function (input, ri, ci) {
      console.log('single');
      var worm = stomp(input);
      var tack = tacky(worm, input[ri][ci].id());
      var section = voom(input, tack.column());

      return Arr.map(section, function (row, r) {
        if (ri === r) {
          return input[ri].slice(0, ci).concat([ Spanning('+1', 1,1), Spanning('+2',1,1) ]).concat(input[ri].slice(ci+1));
        } else {
          return row.on().fold(function () {
            return input[r];
          }, function (on) {
            var grown = Merger.merge(on, {
              colspan: Fun.constant(on.colspan() + 1)
            });
            console.log('on: ', on.id());
            return row.before().concat([grown]).concat(row.after());
          });
        }
      });
    };

    var horizontal = function (input, ri, ci) {
      console.log('horizontal');
      var target = input[ri][ci];
      return Arr.map(input, function (row, r) {
        if (ri === r) {
          var before = row.slice(0, ci);
          var after = row.slice(ci + 1);
          var divided = Util.repeat(target.colspan(), function () {
            return Spanning(target.id(), 1, 1);
          });
          return before.concat(divided).concat(after);
        } else {
          return row;
        }
      });
    };

    var vertical = function (input, ri, ci) {
      console.log('vertical');
      /* TODO: Implement later */
      return input;
    }

    var box = function (input, ri, ci) {
      console.log('box');
      var worm = stomp(input);
      var target = input[ri][ci];
      var tack = tacky(worm, target.id());
      var section = voom(input, tack.column());

      return Arr.map(section, function (row, r) {
        var divided = Util.repeat(target.colspan(), function () {
          return Spanning(target.id(), 1, 1);
        });
        if (r === ri) {
          var before = input[ri].slice(0, ci);
          var after = input[ri].slice(ci + 1);
          return before.concat(divided).concat(after);
        } else if (r > ri && r < ri + target.rowspan()) {
          return row.before().concat(divided).concat(row.after());
        } else {
          return input[r];
        }
      });

    };

    var split = function (input, ri, ci) {
      /* The values coming in here are just direct links to the arrays. */
      if (input.length === 0) return input;
      var target = input[ri] !== undefined ? input[ri][ci] : Spanning('?',0,0);
      var colspan = target.colspan();
      var rowspan = target.rowspan();

      if (colspan === 1 && rowspan === 1) return single(input, ri, ci);
      else if (colspan > 1 && rowspan === 1) return horizontal(input, ri, ci);
      else if (colspan === 1 && rowspan > 1) return vertical(input, ri, ci);
      else return box(input, ri, ci);

      var worm = stomp(input);
      var tack = tacky(worm, target.id());
      var section = voom(input, tack.column());
      return Arr.map(section, function (row, r) {
        if (r === ri) {
          if (colspan !== 1) {
            var divided = Util.repeat(colspan, function (i) {
              return Spanning(target.id() + '_' + i, rowspan, 1); 
            });
            return input[ri].slice(0, ci).concat(divided).concat(input[ri].slice(ci + 1));
          } else {
            var hacked = Spanning(target.id(), 1, 1);
            var created = Spanning('+', 1, 1);  
            return row.before().concat([hacked, created]).concat(row.after());
          }
        } else {
          return row.on().fold(function () {
            console.log('here we are');
            return row.before().concat(row.after());
          }, function (on) {

            var newCell = Merger.merge(on, {
              colspan: Fun.constant(on.colspan() + 1)
            });
          
            /* The situations for a colspan === 1

              1. We are on the correct row, so create a new cell after this one.
              2. We are on rows affected by the rowspan of the split cell, so add a new cell to each of these rows
              3. We are on any other row, so just add a new cell.
            */

            if (r > ri && r < ri + target.rowspan()) {
              return row.before().concat([Spanning(on.id()+'_', 1,1), Spanning(on.id()+'__', 1,1)]).concat(row.after());
            } else {
              return row.before().concat([newCell]).concat(row.after());  
            }
          });
        };
      });
    };

    return {
      voom: voom,
      split: split,
      stomp: stomp
    };
  }
);
