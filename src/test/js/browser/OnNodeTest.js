test(
  'OnNodeTest',

  [
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.OnNode'
  ],

  function (Element, OnNode) {
    var element = Element.fromTag('div');

    var addAlpha = OnNode.addClass('alpha');
    var addBeta = OnNode.addClass('beta');
    var removeAll = OnNode.removeClasses([ 'alpha', 'beta' ]);
    var removeAlpha = OnNode.removeClass('alpha');
    var hasAlpha = OnNode.hasClass('alpha');
    var hasBeta = OnNode.hasClass('beta');

    assert.eq(false, hasAlpha(element));
    addAlpha(element);
    assert.eq(true, hasAlpha(element));
    assert.eq(false, hasBeta(element));
    removeAlpha(element);
    assert.eq(false, hasAlpha(element));
    addAlpha(element);
    assert.eq(true, hasAlpha(element));
    addBeta(element);
    assert.eq(true, hasBeta(element));
    removeAll(element);
    assert.eq(false, hasAlpha(element));
    assert.eq(false, hasBeta(element));
  }
);