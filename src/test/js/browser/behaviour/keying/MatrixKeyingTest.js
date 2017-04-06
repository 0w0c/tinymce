asynctest(
  'Matrix Keying Test',
 
  [
    'ephox.agar.api.FocusTools',
    'ephox.agar.api.Keyboard',
    'ephox.agar.api.Keys',
    'ephox.alloy.api.component.GuiFactory',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Focusing',
    'ephox.alloy.api.behaviour.Keying',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.construct.EventHandler',
    'ephox.alloy.test.GuiSetup',
    'ephox.alloy.test.NavigationUtils',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Arr'
  ],
 
  function (FocusTools, Keyboard, Keys, GuiFactory, Behaviour, Focusing, Keying, Container, EventHandler, GuiSetup, NavigationUtils, Objects, Arr) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    var cells = [
      'c01', 'c02', 'c03', 'c04', 'c05', 'c06',
      'c07', 'c08', 'c09', 'c10', 'c11', 'c12',
      'c13', 'c14', 'c15', 'c16', 'c17', 'c18',
      'c19', 'c20', 'c21'
    ];

    GuiSetup.setup(function (store, doc, body) {
      var rows = Arr.chunk(cells, 6);

      var item = function (classes) {
        return Container.sketch({
          dom: {
            tag: 'span',
            styles: {
              display: 'inline-block',
              width: '20px',
              height: '20px',
              margin: '1px',
              border: '1px solid black'
            },
            classes: [ 'cell' ].concat(classes)
          },
          events: {
            'alloy.execute': EventHandler.nu({
              run: store.adder('item.execute: ' + classes.join(','))
            })
          },
          containerBehaviours: Behaviour.derive([
            Focusing.config({ })
          ])
        });
      };

      return GuiFactory.build(
        Container.sketch({
          dom: {
            classes: [ 'matrix-keying-test'],
            styles: {
              background: 'white',
              width: '150px',
              height: '200px'
            }
          },
          uid: 'custom-uid',
          containerBehaviours: Behaviour.derive([
            Keying.config({
              mode: 'matrix',
              selectors: {
                row: '.row',
                cell: '.cell'
              }
            })
          ]),
          // 4 x 6 grid size
          components: Arr.map(rows, function (row) {
            return Container.sketch({
              dom: {
                tag: 'span',
                classes: [ 'row' ]
              },
              components: Arr.map(row, function (c) {
                return item([ c ]);
              })
            });
          })
        })
      );

    }, function (doc, body, gui, component, store) {

      var targets = Objects.wrapAll(
        Arr.map(cells, function (sq) {
          return {
            key: sq,
            value: {
              label: sq,
              selector: '.' + sq
            }
          };
        })
      );

      return [
        GuiSetup.mSetupKeyLogger(body),
        FocusTools.sSetFocus('Initial focus', gui.element(), '.c11'),
        NavigationUtils.sequence(
          doc,
          Keys.down(),
          {},
          [
            targets.c17,
            targets.c21,
            targets.c03,
            targets.c09,
            targets.c15,
            targets.c21,
            targets.c03
          ]
        ),
        NavigationUtils.sequence(
          doc,
          Keys.left(),
          {  },
          [
            targets.c02,
            targets.c01,
            targets.c06,
            targets.c05,
            targets.c04,
            targets.c03,
            targets.c02,
            targets.c01,
            targets.c06
          ]
        ),
        NavigationUtils.sequence(
          doc,
          Keys.up(),
          {  },
          [
            targets.c21,
            targets.c15,
            targets.c09,
            targets.c03,
            targets.c21,
            targets.c15,
            targets.c09,
            targets.c03,
            targets.c21
          ]
        ),
        NavigationUtils.sequence(
          doc,
          Keys.right(),
          {  },
          [
            targets.c19,
            targets.c20,
            targets.c21,
            targets.c19,
            targets.c20,
            targets.c21
          ]
        ),

        NavigationUtils.sequence(
          doc,
          Keys.left(),
          {  },
          [
            targets.c20,
            targets.c19,
            targets.c21,
            targets.c20,
            targets.c19,
            targets.c21
          ]
        ),

        // Test execute
        Keyboard.sKeydown(doc, Keys.enter(), {}),
        store.sAssertEq(
          'Execute should have c21',
          [ 'item.execute: c21' ]
        ),

        GuiSetup.mTeardownKeyLogger(body, [ ])
      ];
    }, function () {
      success();
    }, failure);
  }
);