define(
  'ephox.alloy.api.SystemEvents',

  [
    'ephox.peanut.Fun'
  ],

  function (Fun) {
    return {
      // This is used to pass focus to a component. A component might interpret
      // this event and pass the DOM focus to one of its children, depending on its
      // focus model.
      focus: Fun.constant('alloy.focus'),

      // This event is fired a small amount of time after the blur has fired. This 
      // allows the handler to know what was the focused element, and what is now.
      postBlur: Fun.constant('alloy.blur.post'),

      // This event is fired by gui.broadcast*. It is defined by 'receivers'
      receive: Fun.constant('alloy.receive'),

      // This event is for executing buttons and things that have (mostly) enter actions
      execute: Fun.constant('alloy.execute'),

      // This event is used by a menu to tell an item to focus itself because it has been
      // selected. This might automatically focus inside the item, it might focus the outer
      // part of the widget etc.
      focusItem: Fun.constant('alloy.focus.item'),


      // Fire by a child element to tell the outer element to close
      sandboxClose: Fun.constant('alloy.sandbox.close'),

      // Fired when adding to a world
      systemInit: Fun.constant('alloy.system.init'),

      // Fired when the window scrolls
      windowScroll: Fun.constant('alloy.system.scroll')
    };
  }
);