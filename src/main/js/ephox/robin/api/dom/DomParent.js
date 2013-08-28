define(
  'ephox.robin.api.dom.DomParent',

  [
    'ephox.boss.api.DomUniverse',
    'ephox.robin.api.general.Parent'
  ],

  function (DomUniverse, Parent) {
    var universe = DomUniverse();

    var sharedBlock = function(elements) {
      return Parent.sharedBlock(universe, elements);
    };

    var sharedOne = function (look, elements) {
      return Parent.sharedOne(universe, function (universe, element) {
        return look(element);
      }, elements);
    };

    var subset = function (start, finish) {
      return Parent.subset(universe, start, finish);
    };

    var breakAt = function (parent, child) {
      return Parent.breakAt(universe, parent, child);
    };

    return {
      sharedOne: sharedOne,
      sharedBlock: sharedBlock,
      subset: subset,
      breakAt: breakAt
    };
  }
);
