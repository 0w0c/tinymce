define(
  'ephox.phoenix.extract.Extract',

  [
    'ephox.compass.Arr',
    'ephox.peanut.Fun',
    'ephox.phoenix.api.data.Spot',
    'ephox.phoenix.extract.TypedItem',
    'ephox.phoenix.extract.TypedList'
  ],

  function (Arr, Fun, Spot, TypedItem, TypedList) {
    /**
     * Flattens the item tree into TypedItem representations.
     *
     * Boundaries are returned twice, before and after their children.
     */
    var typed = function (universe, item) {
      if (universe.property().isText(item)) {
        return [ TypedItem.text(item, universe) ];
      } else if (universe.property().isEmptyTag(item)) {
        return [ TypedItem.empty(item, universe) ];
      } else if (universe.property().isElement(item)) {
        var children = universe.property().children(item);
        var boundary = universe.property().isBoundary(item) ? [TypedItem.boundary(item, universe)] : [];
        var rest = Arr.bind(children, function (child) {
          return typed(universe, child);
        });
        return boundary.concat(rest).concat(boundary);
      } else {
        return [];
      }
    };

    /**
     * Returns just the actual elements from a call to typed().
     */
    var items = function (universe, item) {
      var typedItemList = typed(universe, item);

      var raw = function (item, universe) { return item; };

      return Arr.map(typedItemList, function (typedItem) {
        return typedItem.fold(raw, raw, raw);
      });
    };

    var extractToElem = function (universe, child, offset, item) {
      var extractions = typed(universe, item);
      var prior = TypedList.dropUntil(extractions, child);
      var count = TypedList.count(prior);
      return Spot.point(item, count + offset);
    };

    /**
     * Generates an absolute point in the child's parent
     * that can be used to reference the offset into child later.
     *
     * To find the exact reference later, use Find.
     */
    var extract = function (universe, child, offset) {
      return universe.property().parent(child).fold(function () {
        return Spot.point(child, offset);
      }, function (parent) {
        return extractToElem(universe, child, offset, parent);
      });
    };

    /**
     * Generates an absolute point that can be used to reference the offset into child later.
     * This absolute point will be relative to a parent node (specified by predicate).
     *
     * To find the exact reference later, use Find.
     */
    var extractTo = function (universe, child, offset, pred) {
      return universe.up().predicate(child, pred).fold(function () {
        return Spot.point(child, offset);
      }, function (v) {
        return extractToElem(universe, child, offset, v);
      });
    };

    return {
      typed: typed,
      items: items,
      extractTo: extractTo,
      extract: extract
    };
  }
);
