define(
  'ephox.sugar.demo.Demo',

  [
    'ephox.sugar.api.dom.Insert',
    'ephox.sugar.api.dom.InsertAll',
    'ephox.sugar.api.events.DomEvent',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Css',
    'ephox.sugar.api.properties.Html',
    'global!console',
    'global!document'
  ],

  function (Insert, InsertAll, DomEvent, Element, Css, Html, console, document) {
    return function () {
      var container = Element.fromTag('div');

      var instructions = Element.fromTag('p');
      Html.set(instructions, 'Clicking on the button will remove "width" from the blue rectangle. Clicking it again will do nothing.');
      Insert.append(container, instructions);

      var button = Element.fromTag('button');
      Html.set(button, 'Click on me');
      var input = Element.fromTag('input');

      InsertAll.append(container, [button, input]);

      var doc = Element.fromDom(document);
      DomEvent.bind(doc, 'click', function (event) {
        console.log('target: ', event.target().dom());
        console.log('x: ', event.x());
        console.log('y: ', event.y());

        Css.remove(div, 'width');
      });

      var div = Element.fromTag('div');
      Css.setAll(div, {
        width: '100px',
        height: '300px',
        background: 'blue'
      });

      Insert.append(container, div);

      var ephoxUi = Element.fromDom(document.getElementById('ephox-ui'));
      Insert.append(ephoxUi, container);

    };
  }
);

