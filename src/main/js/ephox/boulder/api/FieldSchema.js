define(
  'ephox.boulder.api.FieldSchema',

  [
    'ephox.boulder.api.FieldPresence',
    'ephox.boulder.core.ValueProcessor',
    'ephox.classify.Type',
    'ephox.perhaps.Result'
  ],

  function (FieldPresence, ValueProcessor, Type, Result) {
    var strict = function (key) {
      return ValueProcessor.field(key, key, FieldPresence.strict(), ValueProcessor.anyValue());
    };

    var strictOf = function (key, schema) {
      return ValueProcessor.field(key, key, FieldPresence.strict(), schema);
    };

    var strictFunction = function (key) {
      return ValueProcessor.field(key, key, FieldPresence.strict(), ValueProcessor.value(function (f) {
        return Type.isFunction(f) ? Result.value(f) : Result.error('Not a function');
      }));
    };

    var forbid = function (key, message) {
      return ValueProcessor.field(
        key,
        key,
        FieldPresence.asOption(),
        ValueProcessor.value(function (v) {
          return Result.error('The field: ' + key + ' is forbidden. ' + message);
        })
      );
    };

    // TODO: Deprecate
    var strictArrayOf = function (key, prop) {
      return strictOf(key, prop);
    };


    var strictObjOf = function (key, objSchema) {
      return ValueProcessor.field(key, key, FieldPresence.strict(), ValueProcessor.obj(objSchema));
    };

    var strictArrayOfObj = function (key, objFields) {
      return ValueProcessor.field(
        key,
        key,
        FieldPresence.strict(),
        ValueProcessor.arrOfObj(objFields)
      );
    };

    var option = function (key) {
      return ValueProcessor.field(key, key, FieldPresence.asOption(), ValueProcessor.anyValue());
    };

    var optionOf = function (key, schema) {
       return ValueProcessor.field(key, key, FieldPresence.asOption(), schema);
    };

    var optionObjOf = function (key, objSchema) {
      return ValueProcessor.field(key, key, FieldPresence.asOption(), ValueProcessor.obj(objSchema));
    };

    var optionObjOfOnly = function (key, objSchema) {
      return ValueProcessor.field(key, key, FieldPresence.asOption(), ValueProcessor.objOnly(objSchema));
    };

    var defaulted = function (key, fallback) {
      return ValueProcessor.field(key, key, FieldPresence.defaulted(fallback), ValueProcessor.anyValue());
    };

    var defaultedOf = function (key, fallback, schema) {
      return ValueProcessor.field(key, key, FieldPresence.defaulted(fallback), schema);
    };

    var defaultedObjOf = function (key, fallback, objSchema) {
      return ValueProcessor.field(key, key, FieldPresence.defaulted(fallback), ValueProcessor.obj(objSchema));
    };

    var field = function (key, okey, presence, prop) {
      return ValueProcessor.field(key, okey, presence, prop);
    };

    var state = function (okey, instantiator) {
      return ValueProcessor.state(okey, instantiator);
    };

    return {
      strict: strict,
      strictOf: strictOf,
      strictObjOf: strictObjOf,
      strictArrayOf: strictArrayOf,
      strictArrayOfObj: strictArrayOfObj,
      strictFunction: strictFunction,

      forbid: forbid,

      option: option,
      optionOf: optionOf,
      optionObjOf: optionObjOf,
      optionObjOfOnly: optionObjOfOnly,

      defaulted: defaulted,
      defaultedOf: defaultedOf,
      defaultedObjOf: defaultedObjOf,

      field: field,
      state: state

      // snapshot?
    };
  }
);