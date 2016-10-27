define(
  'ephox.alloy.spec.FormLabelSpec',

  [
    'ephox.alloy.spec.SpecSchema',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.epithet.Id',
    'ephox.highway.Merger',
    'ephox.scullion.Cell',
    'ephox.sugar.api.Attr'
  ],

  function (SpecSchema, FieldPresence, FieldSchema, ValueSchema, Id, Merger, Cell, Attr) {
    var schema = [
      FieldSchema.field(
        'label',
        'label',
        FieldPresence.strict(),
        ValueSchema.objOf([
          FieldSchema.strict('text')
        ])
      ),
      FieldSchema.strict('field'),
      FieldSchema.strict('prefix')
    ];

    var make = function (spec) {
      var detail = SpecSchema.asStructOrDie('input.spec', schema, spec, [ ]);
      console.log('label.detail', detail);

      var field = Cell(undefined);

      return Merger.deepMerge(spec, {
        uiType: 'custom',
        dom: {
          tag: 'div'
        },
        components: [
          {
            uiType: 'custom',
            dom: {
              tag: 'label',
              innerHtml: detail.label().text()
            }
          },
          detail.field()
        ],
        // Find a nicer way to do this. I'm trying to avoid building any components
        // in these specs.
        delegate: {
          get: function () {
            return field.get();
          }
        },
        postprocess: function (components) {
          var id = Id.generate(detail.prefix());
          field.set(components[1]);
          Attr.set(components[0].element(), 'for', id);
          Attr.set(components[1].element(), 'id', id);
        }
      });
    };

    return {
      make: make
    };
  }
);