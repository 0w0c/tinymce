asynctest(
  'CouplingTest',
 
  [
    'ephox.agar.api.Assertions',
    'ephox.agar.api.Logger',
    'ephox.agar.api.Step',
    'ephox.alloy.api.GuiFactory',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Coupling',
    'ephox.alloy.api.ui.Button',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.registry.Tagger',
    'ephox.alloy.test.GuiSetup',
    'ephox.alloy.test.StepUtils',
    'ephox.sugar.api.Attr',
    'ephox.sugar.api.Node',
    'global!Error'
  ],
 
  function (Assertions, Logger, Step, GuiFactory, Behaviour, Coupling, Button, Container, Tagger, GuiSetup, StepUtils, Attr, Node, Error) {
    var success = arguments[arguments.length - 2];
    var failure = arguments[arguments.length - 1];

    GuiSetup.setup(function (store, doc, body) {
      return GuiFactory.build(
        Container.build({
          uid: 'primary',
          behaviours: Behaviour.derive([
            Coupling.config({
              others: {
                'secondary-1': function (primary) { 
                  return Button.build({
                    dom: {
                      tag: 'button'
                    },
                    action: store.adder('clicked on coupled button of: ' + Attr.get(primary.element(), Tagger.attribute())),
                    text: 'Click me'
                  });
                }
              }
            })
          ])
        })
      );
    }, function (doc, body, gui, component, store) {
      return [
        StepUtils.sAssertFailIs(
          'Testing getCoupled with invalid name: fake',
          'No information found for coupled component: fake',
          function () {
            Coupling.getCoupled(component, 'fake');
          }
        ),

        Logger.t(
          'Testing getCoupled with valid name: secondary-1',
          Step.sync(function () {
            var secondary1 = Coupling.getCoupled(component, 'secondary-1');
            var button1 = secondary1.element();
            Assertions.assertEq('secondary1 should be a button', 'button', Node.name(button1));
            Attr.set(button1, 'data-test', 'marked');

            Assertions.assertEq(
              'secondary1 is not recreated. Should still have attribute: data-test',
              'marked',
              Attr.get(Coupling.getCoupled(component, 'secondary-1').element(), 'data-test')
            );
          })
        ),

        store.sAssertEq('Should be nothing on the store', [ ]),
        Step.sync(function () {
          var secondary1 = Coupling.getCoupled(component, 'secondary-1');
          gui.add(secondary1);
          secondary1.element().dom().click();
        }),
        store.sAssertEq(
          'After clicking, store should have message',
          [ 'clicked on coupled button of: primary' ]
        )
      ];
    }, function () { success(); }, failure);

  }
);