define(
  'ephox.snooker.adjust.Mutation',

  [
    'ephox.porkbun.Event',
    'ephox.porkbun.Events'
  ],

  function (Event, Events) {
    return function () {
      var events = Events.create({
        'drag': Event(['xDelta', 'yDelta'])
      });

      var mutate = function (x, y) {
        events.trigger.drag(x, y);
      };

      return {
        mutate: mutate,
        events: events.registry
      };
    };
  }
);
