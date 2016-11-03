asynctest(
  'ModalDialogTest',
 
  [
    'ephox.agar.api.Keyboard',
    'ephox.agar.api.Keys',
    'ephox.agar.api.Step',
    'ephox.alloy.api.GuiFactory',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.test.GuiSetup',
    'ephox.compass.Arr'
  ],
 
  function (Keyboard, Keys, Step, GuiFactory, Keying, GuiSetup, Arr) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      var makeItem = function (name) {
        return {
          uiType: 'custom',
          dom: {
            tag: 'span',
            styles: {
              display: 'inline-block',
              width: '20px',
              height: '20px',
              border: '1px solid blue'
            },
            classes: [ 'candidate', name ]
          },
          focusing: true
        };
      };

      return GuiFactory.build({
        uiType: 'custom',
        dom: {
          tag: 'div',
          classes: [ 'modal-dialog-example'],
          styles: {
            background: 'gray',
            border: '1px solid black',
            padding: '5px',
            width: '500px',
            height: '400px'
          }
        },
        uid: 'uid-dialog',
        keying: {
          mode: 'cyclic',
          onEscape: store.adderH('dialog.escape'),
          onEnter: store.adderH('dialog.execute')
        },
        components: [
          {
            uiType: 'formlabel',
            field: {
              uiType: 'input',
              placeholder: 'Add URL'
            },
            label: 'Choose URL'
          },
          {
            uiType: 'formlabel',
            field: {
              uiType: 'input'
            },
            label: 'Choose Title  '
          },
          {
            uiType: 'custom',
            dom: {
              tag: 'div'
            },
            keying: {
              mode: 'flow',
              selector: '.candidate',
              execute: store.adder('flow.execute')
            },
            tabstopping: true,
            components: Arr.map([ 'one', 'two', 'three' ], makeItem)
          }
        ]
      });

    }, function (doc, body, gui, component, store) {

      return [
        Step.sync(function () {
          Keying.focusIn(component);
        }),

        Keyboard.sKeydown(doc, Keys.enter(), { }),
        store.sAssertEq('1. After enter, dialog.execute', [ 'dialog.execute' ]),
        store.sClear,

        Keyboard.sKeydown(doc, Keys.enter(), { shift: true }),
        store.sAssertEq('2. After shift+enter, nothing', [ ]),

        Keyboard.sKeydown(doc, Keys.escape(), { }),
        store.sAssertEq('3. After shift+enter, dialog.escape', [ 'dialog.escape' ])
      ];

    }, success, failure);
  }
);