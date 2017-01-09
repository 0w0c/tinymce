asynctest(
  'HighlightingTest',
 
  [
    'ephox.agar.alien.Truncate',
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Chain',
    'ephox.agar.api.NamedChain',
    'ephox.agar.api.UiFinder',
    'ephox.alloy.api.GuiFactory',
    'ephox.alloy.api.behaviour.Highlighting',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.test.ChainUtils',
    'ephox.alloy.test.GuiSetup',
    'ephox.boulder.api.Objects',
    'ephox.compass.Arr',
    'ephox.perhaps.Result',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Class',
    'global!Error'
  ],
 
  function (Truncate, Assertions, Chain, NamedChain, UiFinder, GuiFactory, Highlighting, Container, ChainUtils, GuiSetup, Objects, Arr, Result, Attr, Class, Error) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      var makeItem = function (name) {
        return Container.build({
          dom: {
            tag: 'span',
            styles: {
              display: 'inline-block',
              width: '100px',
              height: '30px',
              border: '1px solid red',
              'text-align': 'center',
              'vertical-align': 'middle'
            },
            innerHtml: name,
            classes: [ name, 'test-item' ]
          }
        });
      };

      return GuiFactory.build(
        Container.build({
          behaviours: Objects.wrapAll([
            Highlighting.config({
              highlightClass: 'test-selected',
              itemClass: 'test-item'
            })
          ]),
          components: Arr.map([
            'alpha',
            'beta',
            'gamma'
          ], makeItem)
        })
      );

    }, function (doc, body, gui, component, store) {
      var cCheckNum = function (label, expected) {
        return Chain.fromChains([
          Chain.mapper(function (array) { return array.length; }),
          Assertions.cAssertEq(label, expected)
        ]);
      };

      var cCheckNumOf = function (label, selector, expected) {
        var field = 'check-' + selector;
        return Chain.fromChains([
          NamedChain.direct('container', UiFinder.cFindAllIn(selector), field),
          NamedChain.direct(field, cCheckNum(label, expected), '_')
        ]);
      };

      var cCheckSelected = function (label, expected) {
        return Chain.fromChains([
          // always check there is only 1
          cCheckNumOf(label + '\nChecking number of selected: ', '.test-selected', 1),
          NamedChain.direct('container', UiFinder.cFindIn('.test-selected'), 'selected'),
          NamedChain.direct('selected', Chain.binder(function (sel) {
            return Class.has(sel, expected) ? Result.value(sel) : 
              Result.error(label + '\nIncorrect element selected. Expected: ' + expected + ', but was: ' + 
                Attr.get(sel, 'class'));
          }), '_')
        ]);
      };

      var cHighlight = Chain.op(function (item) {
        Highlighting.highlight(component, item);
      });

      var cDehighlight = Chain.op(function (item) {
        Highlighting.dehighlight(component, item);
      });

      var cDehighlightAll = Chain.op(function () {
        Highlighting.dehighlightAll(component);
      });

      var cHighlightFirst = Chain.op(function () {
        Highlighting.highlightFirst(component);
      });

      var cHighlightLast = Chain.op(function () {
        Highlighting.highlightLast(component);
      });

      var cIsHighlighted = Chain.mapper(function (item) {
        return Highlighting.isHighlighted(component, item);
      });

      var cGetHighlightedOrDie = Chain.binder(function () {
        return Highlighting.getHighlighted(component).fold(function () {
          return Result.error(new Error('getHighlighted did not find a selection'));
        }, Result.value);
      });

      var cGetHighlightedIsNone = Chain.binder(function (v) {
        return Highlighting.getHighlighted(component).fold(function () {
          return Result.value(v);
        }, function (comp) {
          return Result.error('Highlighted value should be nothing. Was: ' + Truncate.getHtml(comp.element()));
        });
      });

      var cGetFirst = Chain.binder(function () {
        return  Highlighting.getFirst(component).fold(function () {
          return Result.error(new Error('getFirst found nothing'));
        }, Result.value);
      });

      var cGetLast = Chain.binder(function () {
        return Highlighting.getLast(component).fold(function () {
          return Result.error(new Error('getLast found nothing'));
        }, Result.value);
      });

      var cHasClass = function (clazz) {
        return Chain.binder(function (comp) {
          var elem = comp.element();
          return Class.has(elem, clazz) ? Result.value(elem) : 
            Result.error('element ' + Truncate.getHtml(elem) + ' did not have class: ' + clazz);
        });
      };

      var cFindComponent = function (selector) {
        return Chain.fromChains([
          UiFinder.cFindIn(selector),
          ChainUtils.eToComponent(component)
        ]);
      };

      return [
        Chain.asStep({}, [
          NamedChain.asChain([
            NamedChain.writeValue('container', component.element()),
            NamedChain.direct('container', cFindComponent('.alpha'), 'alpha'),
            NamedChain.direct('container', cFindComponent('.beta'), 'beta'),
            NamedChain.direct('container', cFindComponent('.gamma'), 'gamma'),

            cCheckNumOf('Should be none selected', '.test-selected', 0),
            cCheckNumOf('Should be three items', '.test-item', 3),

            NamedChain.write('first', cGetFirst),
            NamedChain.write('last', cGetLast),

            NamedChain.direct('first', cHasClass('alpha'), '_'),
            NamedChain.direct('last', cHasClass('gamma'), '_'),

            cHighlightFirst,
            cCheckSelected('highlightFirst => Alpha is selected', 'alpha'),

            cHighlightLast,
            cCheckSelected('highlightLast => Gamma is selected', 'gamma'),

            NamedChain.direct('beta', cHighlight, '_'),
            cCheckSelected('highlight(beta) => Beta is selected', 'beta'),
        
            NamedChain.direct('beta', cDehighlight, '_'),
            cCheckNumOf('beta should be deselected', '.test-selected', 0),

            cHighlightFirst,
            cCheckSelected('highlightFirst => Alpha is selected', 'alpha'),
            cDehighlightAll,
            cCheckNumOf('everything should be deselected', '.test-selected', 0),

            cHighlightLast,
            NamedChain.direct('beta', cIsHighlighted, 'beta-is'),
            NamedChain.direct('beta-is', Assertions.cAssertEq('isHighlighted(beta)', false), '_'),

            NamedChain.direct('gamma', cIsHighlighted, 'gamma-is'),
            NamedChain.direct('gamma-is', Assertions.cAssertEq('isHighlighted(gamma)', true), '_'),

            NamedChain.direct('container', cGetHighlightedOrDie, 'highlighted-comp'),
            NamedChain.direct('highlighted-comp', cHasClass('gamma'), '_'),

            cDehighlightAll,
            NamedChain.direct('container', cGetHighlightedIsNone, '_')
          ])
        ])
      ];
    }, function () { success(); }, failure);

  }
);