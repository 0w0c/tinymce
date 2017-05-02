define(
  'ephox.alloy.behaviour.focusing.FocusApis',

  [
    'ephox.sugar.api.dom.Focus'
  ],

  function (Focus) {
    var focus = function (component, focusConfig) {
      if (! focusConfig.ignore()) {
        Focus.focus(component.element());
        focusConfig.onFocus()(component);
      }
    };

    var blur = function (component, focusConfig) {
      if (! focusConfig.ignore()) {
        Focus.blur(component.element());
      }
    };

    var isFocused = function (component) {
      return Focus.hasFocus(component.element());
    };

    return {
      focus: focus,
      blur: blur,
      isFocused: isFocused
    };
  }
);