define(
  'ephox.phoenix.api.general.Wrapping',

  [
    'ephox.phoenix.wrap.Wrapper',
    'ephox.phoenix.wrap.Wraps'
  ],

  /**
   * Documentation is in the actual implementations.
   */
  function (Wrapper, Wraps) {
    var nu = function (universe, element) {
      return Wraps(universe, element);
    };

    var wrapWith = function (universe, base, baseOffset, end, endOffset, c) {
      return Wrapper.wrapWith(universe, base, baseOffset, end, endOffset, c);
    };

    var wrapper = function (universe, wrapped, c) {
      return Wrapper.wrapper(universe, wrapped, c);
    };

    var leaves = function (universe, base, baseOffset, end, endOffset, c) {
      return Wrapper.leaves(universe, base, baseOffset, end, endOffset, c);
    };

    return {
      nu: nu,
      wrapWith: wrapWith,
      wrapper: wrapper,
      leaves: leaves
    };
  }
);
