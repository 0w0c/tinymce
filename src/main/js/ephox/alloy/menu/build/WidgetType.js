define(
  'ephox.alloy.menu.build.WidgetType',

  [
    'ephox.alloy.api.SystemEvents',
    'ephox.alloy.construct.EventHandler',
    'ephox.alloy.menu.util.ItemEvents',
    'ephox.alloy.menu.util.MenuMarkers',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.perhaps.Option',
    'ephox.sugar.api.Traverse'
  ],

  function (SystemEvents, EventHandler, ItemEvents, MenuMarkers, FieldPresence, FieldSchema, Objects, Option, Traverse) {
    var schema = [
      FieldSchema.strict('value'),
      FieldSchema.strict('spec'),
      FieldSchema.strict('markers'),
      FieldSchema.defaulted('classes', [ ]),
      FieldSchema.state('builder', function () {
        return builder;
      })
    ];

    // FIX: Bring this in line with templating.
    var builder = function (info) {
      return {
        uiType: 'custom',
        dom: {
          tag: 'li',
          classes: [ info.markers().item ]
        },
        representing: {
          query: function () {
            return info.value();
          },
          set: function () { }
        },
        components: [ info.spec() ],
        events: Objects.wrapAll([
          {
            key: SystemEvents.execute(),
            value: EventHandler.nu({
              run: function (component, simulatedEvent) {
                // The top component is the list item, so focus in the widget which
                // is the first child.
                Traverse.firstChild(component.element()).bind(component.getSystem().getByDom).each(function (widget) {
                  widget.apis().focusIn();
                  simulatedEvent.stop();
                });
              }
            })
          },
          {
            key: 'mouseover',
            value: ItemEvents.hoverHandler
          }

        ]),
        focusing: {
          onFocus: function (component) {
            ItemEvents.onFocus(component);
          }
        },
        keying: {
          mode: 'escaping',
          onEscape: function (component, simulatedEvent) {
            // If the outer list item didn't have focus, 
            // then focus it (i.e. escape the inner widget)
            if (!component.apis().isFocused()) {
              component.apis().focus();
              return Option.some(true);
            } else {
              return Option.none();
            }
          }
        }
      };
    };

    return schema;
  }
);