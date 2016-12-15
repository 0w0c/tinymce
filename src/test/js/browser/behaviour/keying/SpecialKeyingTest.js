asynctest(
  'SpecialKeyingTest',
 
  [
    'ephox.agar.api.FocusTools',
    'ephox.agar.api.GeneralSteps',
    'ephox.agar.api.Keyboard',
    'ephox.agar.api.Keys',
    'ephox.alloy.api.GuiFactory',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.test.GuiSetup',
    'ephox.boulder.api.Objects'
  ],
 
  function (FocusTools, GeneralSteps, Keyboard, Keys, GuiFactory, Focusing, Keying, GuiSetup, Objects) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      return GuiFactory.build({
        uiType: 'custom',
        dom: {
          tag: 'div',
          classes: 'special-keying'
        },
        behaviours: Objects.wrapAll([
          Focusing.config({ }),
          Keying.config({
            mode: 'special',
            onSpace: store.adderH('space'),
            onEnter: store.adderH('enter'),
            onShiftEnter: store.adderH('shift+enter'),
            onLeft: store.adderH('left'),
            onUp: store.adderH('up'),
            onDown: store.adderH('down'),
            onRight: store.adderH('right'),
            onEscape: store.adderH('escape')
          })
        ])
      });

    }, function (doc, body, gui, component, store) {
      var press = function (expected, key, modifiers) {
        return GeneralSteps.sequence([
          store.sClear,
          Keyboard.sKeydown(doc, key, modifiers),
          store.sAssertEq('Pressing ' + expected, [ expected ])
        ]);
      };

      return [
        GuiSetup.mSetupKeyLogger(body),
        FocusTools.sSetFocus('Start on component', gui.element(), '.special-keying'),
        press('space', Keys.space(), { }),
        press('enter', Keys.enter(), { }),
        press('shift+enter', Keys.enter(), { shift: true }),
        press('left', Keys.left(), { }),
        press('up', Keys.up(), { }),
        press('down', Keys.down(), { }),
        press('right', Keys.right(), { }),
        press('escape', Keys.escape(), { }),
        GuiSetup.mTeardownKeyLogger(body, [  ])
      ];
    }, function () { success(); }, failure);

  }
);