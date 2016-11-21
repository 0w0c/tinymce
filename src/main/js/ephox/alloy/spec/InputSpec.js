define(
  'ephox.alloy.spec.InputSpec',

  [
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.Objects',
    'ephox.boulder.api.ValueSchema',
    'ephox.compass.Arr',
    'ephox.highway.Merger',
    'ephox.sugar.api.Value'
  ],

  function (FieldSchema, Objects, ValueSchema, Arr, Merger, Value) {
    // This is not fleshed out yet.
    var schema = ValueSchema.objOf([
      FieldSchema.defaulted('classes', [ ]),
      FieldSchema.option('value'),
      FieldSchema.option('placeholder'),
      FieldSchema.defaulted('type', 'input'),
      FieldSchema.defaulted('tag', 'input'),
      FieldSchema.defaulted('tabstop', true)
    ]);

    var make = function (spec) {
      var detail = ValueSchema.asStructOrDie('input.spec', schema, spec);

      var toProp = function (opt, name) {
        return opt.map(function (v) {
          return [ { key: name, value: v } ];
        }).getOr([ ]);
      };

      return Merger.deepMerge({
        uiType: 'custom',
        // Simplify this
        dom: Objects.wrapAll(
          Arr.flatten([
            toProp(detail.value(), 'value'),
            [
              { key: 'tag', value: detail.tag() },              
              {
                key: 'attributes',
                value: Objects.wrapAll(
                  Arr.flatten([
                    toProp(detail.placeholder(), 'placeholder'),
                    [ { key: 'type', value: detail.type() }]
                  ])
                )
              }
            ]
          ])
        ),

        representing: {
          query: function (comp) {
            return Value.get(comp.element());
          },
          set: function (comp, value) {
            Value.set(comp.element(), value);
          }
        },

        tabstopping: detail.tabstop(),
        focusing: {
          onFocus: function (component) {
            var input = component.element();
            var value = Value.get(input);
            input.dom().setSelectionRange(0, value.length);
          }
        }
      }, spec);
    };

    return {
      make: make
    };
  }
);