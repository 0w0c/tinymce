define(
  'ephox.alloy.api.ui.TouchMenu',

  [
    'ephox.alloy.alien.ElementFromPoint',
    'ephox.alloy.api.behaviour.AddEventsBehaviour',
    'ephox.alloy.api.behaviour.Behaviour',
    'ephox.alloy.api.behaviour.Coupling',
    'ephox.alloy.api.behaviour.Highlighting',
    'ephox.alloy.api.behaviour.Representing',
    'ephox.alloy.api.behaviour.Sandboxing',
    'ephox.alloy.api.behaviour.Toggling',
    'ephox.alloy.api.behaviour.Transitioning',
    'ephox.alloy.api.behaviour.Unselecting',
    'ephox.alloy.api.events.AlloyEvents',
    'ephox.alloy.api.events.AlloyTriggers',
    'ephox.alloy.api.events.NativeEvents',
    'ephox.alloy.api.events.SystemEvents',
    'ephox.alloy.api.ui.InlineView',
    'ephox.alloy.api.ui.Menu',
    'ephox.alloy.api.ui.Sketcher',
    'ephox.alloy.dropdown.DropdownUtils',
    'ephox.alloy.ui.schema.TouchMenuSchema',
    'ephox.boulder.api.Objects',
    'ephox.katamari.api.Cell',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Merger',
    'ephox.sugar.api.dom.Focus',
    'global!document'
  ],

  function (
    ElementFromPoint, AddEventsBehaviour, Behaviour, Coupling, Highlighting, Representing, Sandboxing, Toggling, Transitioning, Unselecting, AlloyEvents, AlloyTriggers,
    NativeEvents, SystemEvents, InlineView, Menu, Sketcher, DropdownUtils, TouchMenuSchema, Objects, Cell, Fun, Merger, Focus, document
  ) {
    var factory = function (detail, components, spec, externals) {

      var getMenu = function (component) {
        var sandbox = Coupling.getCoupled(component, 'sandbox');
        return Sandboxing.getState(sandbox);
      };

      var hoveredState = Cell(false);

      var hoverOn = function (component) {
        if (hoveredState.get() === false) {
          forceHoverOn(component);
        }
      };

      var forceHoverOn = function (component) {
        detail.onHoverOn()(component);
        hoveredState.set(true);
      };

      var hoverOff = function (component) {
        if (hoveredState.get() === true) {
          detail.onHoverOff()(component);
          hoveredState.set(false);
        }
      };

      return Merger.deepMerge(
        {
          uid: detail.uid(),
          dom: detail.dom(),
          components: components,
          behaviours: Merger.deepMerge(
            Behaviour.derive([
              // Button showing the the touch menu is depressed
              Toggling.config({
                toggleClass: detail.toggleClass(),
                aria: {
                  mode: 'pressed',
                  syncWithExpanded: true
                }
              }),
              Unselecting.config({ }),
              // Menu that shows up
              Coupling.config({
                others: {
                  sandbox: function (hotspot) {

                    return InlineView.sketch(
                      Merger.deepMerge(
                        externals.view(),
                        {
                          lazySink: DropdownUtils.getSink(hotspot, detail),
                          inlineBehaviours: Behaviour.derive([
                            AddEventsBehaviour.config('execute-for-menu', [
                              AlloyEvents.runOnExecute(function (c, s) {
                                var target = s.event().target();
                                c.getSystem().getByDom(target).each(function (item) {
                                  detail.onExecute()(hotspot, c, item, Representing.getValue(item));
                                });
                              })
                            ]),

                            // Animation
                            Transitioning.config({
                              initialState: 'closed',
                              destinationAttr: 'data-longpress-destination',
                              stateAttr: 'data-longpress-state',

                              routes: Transitioning.createBistate(
                                'open',
                                'closed',
                                detail.menuTransition().map(function (t) {
                                  return Objects.wrap('transition', t);
                                }).getOr({ })
                              ),

                              onFinish: function (view, destination) {
                                if (destination === 'closed') {
                                  InlineView.hide(view);
                                  detail.onClosed()(hotspot, view);
                                }
                              }
                            })


                          ]),

                          onShow: function (view) {
                            Transitioning.progressTo(view, 'open');
                          }
                        }
                      )
                    );
                  }
                }
              })
            ]),
            detail.touchmenuBehaviours()
          ),

          events: AlloyEvents.derive([

            AlloyEvents.abort(NativeEvents.contextmenu(), Fun.constant(true)),

            AlloyEvents.run(NativeEvents.touchstart(), function (comp, se) {
              Toggling.on(comp);
            }),

            AlloyEvents.run(SystemEvents.tap(), function (comp, se) {
              detail.onTap()(comp);
            }),

            // On longpress, create the menu items to show, and put them in the sandbox.
            AlloyEvents.run(SystemEvents.longpress(), function (component, simulatedEvent) {
              detail.fetch()(component).get(function (items) {
                forceHoverOn(component);
                var iMenu = Menu.sketch(
                  Merger.deepMerge(
                    externals.menu(),
                    {
                      items: items
                    }
                  )
                );

                var sandbox = Coupling.getCoupled(component, 'sandbox');
                var anchor = detail.getAnchor()(component);
                InlineView.showAt(sandbox, anchor, iMenu);
              });
            }),

            // 1. Find if touchmove over button or any items
            //   - if over items, trigger mousemover on item (and hoverOff on button)
            //   - if over button, (dehighlight all items and trigger hoverOn on button if required)
            //   - if over nothing (dehighlight all items and trigger hoverOff on button if required)
            AlloyEvents.run(NativeEvents.touchmove(), function (component, simulatedEvent) {
              var e = simulatedEvent.event().raw().touches[0];
              getMenu(component).each(function (iMenu) {
                ElementFromPoint.insideComponent(iMenu, e.clientX, e.clientY).fold(function () {
                  // No items, so blur everything.
                  Highlighting.dehighlightAll(iMenu);

                  // INVESTIGATE: Should this focus.blur be called? Should it only be called here?
                  Focus.active().each(Focus.blur);

                  // could not find an item, so check the button itself
                  var hoverF = ElementFromPoint.insideComponent(component, e.clientX, e.clientY).fold(
                    Fun.constant(hoverOff),
                    Fun.constant(hoverOn)
                  );
                  hoverF(component);
                }, function (elem) {
                  AlloyTriggers.dispatchWith(component, elem, NativeEvents.mouseover(), {
                    x: e.clientX,
                    y: e.clientY
                  });
                  hoverOff(component);
                });
                simulatedEvent.stop();
              });
            }),

            // 1. Trigger execute on any selected item
            // 2. Close the menu
            // 3. Depress the button
            AlloyEvents.run(NativeEvents.touchend(), function (component, simulatedEvent) {

              getMenu(component).each(function (iMenu) {
                Highlighting.getHighlighted(iMenu).each(AlloyTriggers.emitExecute);
              });

              var sandbox = Coupling.getCoupled(component, 'sandbox');
              Transitioning.progressTo(sandbox, 'closed');
              Toggling.off(component);
            }),

            AlloyEvents.runOnDetached(function (component, simulatedEvent) {
              var sandbox = Coupling.getCoupled(component, 'sandbox');
              InlineView.hide(sandbox);
            })
          ]),

          eventOrder: Merger.deepMerge(
            detail.eventOrder(),
            {
              // Order, the button state is toggled first, so assumed !selected means close.
              'alloy.execute': [ 'toggling', 'alloy.base.behaviour' ]
            }
          )
        },
        {
          dom: {
            attributes: {
              role: detail.role().getOr('button')
            }
          }
        }
      );
    };

    return Sketcher.composite({
      name: 'TouchMenu',
      configFields: TouchMenuSchema.schema(),
      partFields: TouchMenuSchema.parts(),
      factory: factory
    });
  }
);
