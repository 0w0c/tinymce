define(
  'ephox.alloy.behaviour.Dragging',

  [
    'ephox.alloy.behaviour.Behaviour',
    'ephox.alloy.dom.DomModification',
    'ephox.alloy.dragging.MouseDragging',
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.api.FieldSchema',
    'ephox.boulder.api.ValueSchema',
    'ephox.peanut.Fun'
  ],

  function (Behaviour, DomModification, MouseDragging, FieldPresence, FieldSchema, ValueSchema, Fun) {
    var behaviourName = 'dragging';

    var schema = FieldSchema.field(
      behaviourName,
      behaviourName,
      FieldPresence.asOption(),
      ValueSchema.choose(
        'mode',
        {
          'mouse': MouseDragging
        }
      )
    );



    var doCommand1 = function (component, bInfo) {
      /* */
    };

    var exhibit = function (info, base) {
      return info[behaviourName]().fold(function () {
        return DomModification.nu({ });
      }, function (/* */) {
        return DomModification.nu({ });
      });
    };

    var apis = function (info) {
      return {
        command1: Behaviour.tryActionOpt(behaviourName, info, 'command1', doCommand1)
      };
    };

    var handlers = function (info) {
      var bInfo = info[behaviourName]();
      return bInfo.fold(function () {
        return { };
      }, function (/* */) {
        return { };
      });
    };

    return Behaviour.contract({
      name: Fun.constant(behaviourName),
      exhibit: exhibit,
      handlers: handlers,
      apis: apis,
      schema: Fun.constant(schema)
    });
  }
);