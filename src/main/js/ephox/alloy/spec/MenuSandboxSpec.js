define(
  'ephox.alloy.spec.MenuSandboxSpec',

  [
    'ephox.alloy.alien.ComponentStructure',
    'ephox.alloy.menu.spi.MenuConfig',
    'ephox.alloy.menu.util.MenuMarkers',
    'ephox.alloy.sandbox.Dismissal',
    'ephox.alloy.spec.SpecSchema',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.perhaps.Option'
  ],

  function (ComponentStructure, MenuConfig, MenuMarkers, Dismissal, SpecSchema, FieldPresence, FieldSchema, ValueSchema, Option) {
    var schema = [
      // This hotspot is going to have to be a little more advanced when we get away from menus and dropdowns
      FieldSchema.strict('lazyHotspot'),
      FieldSchema.strict('onClose'),
      FieldSchema.strict('onOpen'),
      FieldSchema.defaulted('onExecute', Option.none),
      FieldSchema.strict('sink'),
      FieldSchema.defaulted('itemValue', 'data-item-value'),
      FieldSchema.defaulted('backgroundClass', 'background-menu'),
      FieldSchema.field(
        'markers',
        'markers',
        FieldPresence.defaulted(MenuMarkers.fallback()),
        MenuMarkers.schema()
      )
    ];

    var make = function (spec) {
      // Not ideal that it's raw.
      var detail = SpecSchema.asRawOrDie('menusandbox.spec', schema, spec);

      var config = MenuConfig(detail);

      var isExtraPart = function (sandbox, target) {
        return ComponentStructure.isPartOf(detail.lazyHotspot(), target);
      };

      return {
        uiType: 'custom',
        dom: {
          tag: 'div'
        },
        sandboxing: config.sandboxing,
        keying: config.keying,
        receiving: Dismissal.receiving({
          isExtraPart: isExtraPart
        }),
        events: config.events,
        highlighting: {
          highlightClass: detail.markers.selectedMenu,
          itemClass: detail.markers.menu
        }
      };
    };

    return {
      make: make
    };
  }
);