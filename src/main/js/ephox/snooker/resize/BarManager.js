define(
  'ephox.snooker.resize.BarManager',

  [
    'ephox.dragster.api.Dragger',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.snooker.resize.BarMutation',
    'ephox.snooker.resize.Bars',
    'ephox.snooker.style.Styles',
    'ephox.snooker.util.CellUtils',
    'ephox.syrup.api.Attr',
    'ephox.syrup.api.Class',
    'ephox.syrup.api.Css',
    'ephox.syrup.api.DomEvent',
    'ephox.syrup.api.Node',
    'ephox.syrup.api.SelectorExists',
    'ephox.syrup.api.SelectorFind',
    'global!parseInt'
  ],

  function (Dragger, Fun, Option, Event, Events, BarMutation, Bars, Styles, CellUtils, Attr, Class, Css, DomEvent, Node, SelectorExists, SelectorFind, parseInt) {
    var resizeBar = Styles.resolve('resizer-bar');
    var resizeBarDragging = Styles.resolve('resizer-bar-dragging');

    return function (wire, direction, hdirection) {
      var mutation = BarMutation();
      var resizing = Dragger.transform(mutation, {});

      var hoverTable = Option.none();

      var getResizer = function (element, type) {
        return Option.from(Attr.get(element, type));
      };

      /* Reposition the bar as the user drags */
      mutation.events.drag.bind(function (event) {
        getResizer(event.target(), 'data-row').each(function (_dataRow) {
          var currentRow = CellUtils.getInt(event.target(), 'top');
          Css.set(event.target(), 'top', currentRow + event.yDelta() + 'px');
        });

        getResizer(event.target(), 'data-column').each(function (_dataCol) {
          var currentCol = CellUtils.getInt(event.target(), 'left');
          Css.set(event.target(), 'left', currentCol + event.xDelta() + 'px');
        });
      });

      var getDelta = function (target, direction) {
        var newX = CellUtils.getInt(target, direction);
        var oldX = parseInt(Attr.get(target, 'data-initial-' + direction), 10);
        return newX - oldX;
      };

      /* Resize the column once the user releases the mouse */
      resizing.events.stop.bind(function () {
        mutation.get().each(function (target) {
          hoverTable.each(function (table) {
            getResizer(target, 'data-row').each(function (row) {
              var delta = getDelta(target, 'top');
              Attr.remove(target, 'data-initial-top');
              events.trigger.adjustHeight(table, delta, parseInt(row, 10));
            });

            getResizer(target, 'data-column').each(function (column) {
              var delta = getDelta(target, 'left');
              Attr.remove(target, 'data-initial-left');
              events.trigger.adjustWidth(table, delta, parseInt(column, 10));
            });

            Bars.refresh(wire, table, hdirection, direction);
          });
        });

      });

      var handler = function (target, direction) {
        events.trigger.startAdjust();
        mutation.assign(target);
        Attr.set(target, 'data-initial-' + direction, parseInt(Css.get(target, direction), 10));
        Class.add(target, resizeBarDragging);
        Css.set(target, 'opacity', '0.2');
        resizing.go(wire.parent());
      };

      /* Start the dragging when the bar is clicked, storing the initial position. */
      var mousedown = DomEvent.bind(wire.parent(), 'mousedown', function (event) {
        if (Bars.isRowBar(event.target())) handler(event.target(), 'top');

        if (Bars.isColBar(event.target())) handler(event.target(), 'left');
      });

      /* When the mouse moves within the table, refresh the bars. */
      var mouseover = DomEvent.bind(wire.view(), 'mouseover', function (event) {
        if (Node.name(event.target()) === 'table' || SelectorExists.ancestor(event.target(), 'table')) {
          hoverTable = Node.name(event.target()) === 'table' ? Option.some(event.target()) : SelectorFind.ancestor(event.target(), 'table');
          hoverTable.each(function (ht) {
            Bars.refresh(wire, ht, hdirection, direction);
          });
        }
      });

      /* When the mouse moves out of the table (or a resizer div that is not dragging), remove the bars */
      var mouseout = DomEvent.bind(wire.view(), 'mouseout', function (event) {
        if (Node.name(event.target()) === 'table' || (Node.name(event.target()) === 'div' &&
            Class.has(event.target(), resizeBar) && !Class.has(event.target(), resizeBarDragging))) {
          Bars.destroy(wire);
        }
      });

      var destroy = function () {
        mousedown.unbind();
        mouseover.unbind();
        mouseout.unbind();
        firefoxDrag.unbind();
        resizing.destroy();
        Bars.destroy(wire);
      };

      /* This is required on Firefox to stop the default drag behaviour interfering with dragster */
      var firefoxDrag = DomEvent.bind(wire.view(), 'dragstart', function (event) {
        event.raw().preventDefault();
      });

      var refresh = function (tbl) {
        Bars.refresh(wire, tbl, hdirection, direction);
      };

      var events = Events.create({
        adjustHeight: Event(['table', 'delta', 'row']),
        adjustWidth: Event(['table', 'delta', 'column']),
        startAdjust: Event([])
      });

      return {
        destroy: destroy,
        refresh: refresh,
        on: resizing.on,
        off: resizing.off,
        hideBars: Fun.curry(Bars.hide, wire),
        showBars: Fun.curry(Bars.show, wire),
        events: events.registry
      };
    };
  }
);