define(
  'ephox.alloy.behaviour.Sandboxing',

  [
    'ephox.alloy.api.behaviour.Positioning',
    'ephox.alloy.behaviour.Behaviour',
    'ephox.alloy.dom.DomModification',
    'ephox.alloy.sandbox.Manager',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.peanut.Fun',
    'ephox.perhaps.Option',
    'ephox.scullion.Cell',
    'ephox.sugar.api.Remove'
  ],

  function (Positioning, Behaviour, DomModification, Manager, FieldPresence, FieldSchema, ValueSchema, Fun, Option, Cell, Remove) {
    var schema = FieldSchema.field(
      'sandboxing',
      'sandboxing',
      FieldPresence.asOption(),
      ValueSchema.objOf([
        FieldSchema.state('state', function () {
          return Cell(Option.none());
        }),
        FieldSchema.defaulted('onOpen', Fun.noop),
        FieldSchema.defaulted('onClose', Fun.noop),
        FieldSchema.strict('sink'),
        FieldSchema.strict('manager')
      ])
    );

    var clear = function (sandbox, sInfo) {
      if (sInfo.state().get().isSome()) {
        Manager.clear(sandbox, sInfo);
        sInfo.sink().getSystem().removeFromWorld(sandbox);
      }
    };

    // NOTE: A sandbox should not start as part of the world. It is expected to be
    // added to the sink on rebuild.
    var rebuildSandbox = function (sandbox, sInfo, data) {
      clear(sandbox, sInfo);
      Remove.empty(sandbox.element());
      Positioning.addContaienr(sInfo.sink(), sandbox);
      sInfo.sink().getSystem().addToWorld(sandbox);
      var output = Manager.populate(sandbox, sInfo, data);
      sInfo.state().set(
        Option.some(output)
      );
      return output;
    };

    var previewSandbox = function (sandbox, sInfo) {
      Manager.preview(sandbox, sInfo);
    };

    var gotoSandbox = function (sandbox, sInfo) {
      if (isShowing(sandbox, sInfo)) Manager.enter(sandbox, sInfo);
    };

    // Open sandbox transfers focus to the opened menu
    var openSandbox = function (sandbox, sInfo, futureData) {
      return futureData.map(function (data) {
        var state = rebuildSandbox(sandbox, sInfo, data);
        // Focus the sandbox.
        gotoSandbox(sandbox, sInfo);
        sInfo.onOpen()(sandbox, state);
        return state;
      });
    };

    // Show sandbox does not transfer focus to the opened menu
    var showSandbox = function (sandbox, sInfo, futureData) {
      return futureData.map(function (data) {
        var state = rebuildSandbox(sandbox, sInfo, data);
        // Preview the sandbox without focusing it
        previewSandbox(sandbox, sInfo);
        sInfo.onOpen()(sandbox, state);
        return state;
      });
    };

    var closeSandbox = function (sandbox, sInfo) {
      sInfo.state().get().each(function (state) {
        Manager.clear(sandbox, sInfo);
        Remove.empty(sandbox.element());
        sandbox.getSystem().removeFromWorld(sandbox);
        Positioning.removeContainer(sInfo.sink(), sandbox);
        sInfo.onClose()(sandbox, state);
        sInfo.state().set(Option.none());
      });
    };

    var isShowing = function (sandbox, sInfo) {
      return sInfo.state().get().isSome();
    };

    var isPartOf = function (sandbox, sInfo, queryElem) {
      return isShowing(sandbox, sInfo) && Manager.isPartOf(sandbox, sInfo, queryElem);
    };

    var getState = function (sandbox, sInfo) {
      return sInfo.state().get();
    };

    var exhibit = function (info, base) {
      return DomModification.nu({ });
    };

    var apis = function (info) {
      return Behaviour.activeApis(
        'sandboxing',
        info,
        {
          openSandbox: openSandbox,
          closeSandbox: closeSandbox,
          isShowing: isShowing,
          isPartOf: isPartOf,
          showSandbox: showSandbox,
          gotoSandbox: gotoSandbox,
          getState: getState
        }
      );
    };

    return Behaviour.contract({
      name: Fun.constant('sandboxing'),
      exhibit: exhibit,
      handlers: Fun.constant({ }),
      apis: apis,
      schema: Fun.constant(schema)
    });
  }
);