test(
  'Binder',

  [
    'ephox.porkbun.Binder',
    'ephox.porkbun.Event',
    'ephox.porkbun.Events',
    'ephox.katamari.api.Struct'
  ],

  function (Binder, Event, Events, Struct) {
    var events = Events.create({
      myEvent: Event([ ]),
      secondEvent: Event([ ])
    });

    var binder = Binder.create();

    var called = false;

    binder.bind(events.registry.myEvent, function(event) {
      called = true;
    });

    assert.throws(function () {
      binder.bind(events.registry.myEvent, function(event) {
        called = true;
      });
    });

    events.trigger.myEvent();
    assert.eq(true, called);

    called = false;

    binder.unbind(events.registry.myEvent);

    events.trigger.myEvent();
    assert.eq(false, called);

    assert.throws(function () {
      binder.unbind(events.registry.myEvent);
    });



    var count = 0;

    binder.bind(events.registry.myEvent, function(event) {
      count++;
    });

    binder.bind(events.registry.secondEvent, function(event) {
      count++;
    });

    binder.unbindAll();

    events.trigger.myEvent();
    events.trigger.secondEvent();

    assert.eq(0, count);
  }
);
