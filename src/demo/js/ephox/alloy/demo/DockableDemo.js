define(
  'ephox.alloy.demo.DockableDemo',

  [
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Docking',
    'ephox.alloy.api.behaviour.Dragging',
    'ephox.alloy.api.system.Attachment',
    'ephox.alloy.api.system.Gui',
    'ephox.alloy.api.ui.Container',
    'ephox.alloy.demo.HtmlDisplay',
    'ephox.katamari.api.Option',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Class',
    'ephox.sugar.api.properties.Css',
    'global!document'
  ],

  function (Behaviour, Docking, Dragging, Attachment, Gui, Container, HtmlDisplay, Option, Element, Class, Css, document) {
    return function () {
      var gui = Gui.create();
      var body = Element.fromDom(document.body);
      Class.add(gui.element(), 'gui-root-demo-container');
      // Css.set(gui.element(), 'direction', 'rtl');

      Attachment.attachSystem(body, gui);
      // Css.set(body, 'margin-top', '2000px');
      Css.set(body, 'margin-bottom', '2000px');

      var dockable = HtmlDisplay.section(
        gui,
        'The blue panel will always stay on screen as long as the red rectangle is on screen',
        Container.sketch({
          uid: 'panel-container',
          dom: {
            styles: {
              background: 'red',
              'margin-top': '1400px',
              width: '500px',
              height: '3600px',
              'z-index': '50'
            }
          },
          components: [
            Container.sketch({
              dom: {
                styles: {
                  background: '#cadbee',
                  width: '400px',
                  height: '50px',
                  border: '2px solid black',
                  position: 'absolute',
                  top: '2500px',
                  left: '150px',
                  'z-index': '100'
                }
              },
              containerBehaviours: Behaviour.derive([
                Dragging.config({
                  mode: 'mouse',
                  blockerClass: [ 'blocker' ]
                }),

                Docking.config({
                  contextual: {
                    transitionClass: 'demo-alloy-dock-transition',
                    fadeOutClass: 'demo-alloy-dock-fade-out',
                    fadeInClass: 'demo-alloy-dock-fade-in',
                    lazyContext: function (component) {
                      return component.getSystem().getByUid('panel-container').fold(Option.none, function (comp) {
                        return Option.some(comp.element());
                      });
                    }
                  },
                  leftAttr: 'data-dock-left',
                  topAttr: 'data-dock-top'
                })
              ])
            })
          ]
        })
      );

    };
  }
);