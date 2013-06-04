test(
  'StylingTest',

  [
    'ephox.boss.mutant.Styling'
  ],

  function (Styling) {

    var item = {
      css: {
        border: '10'
      }
    };

    assert.eq({ border: '10' }, item.css);
    Styling.set(item, 'cat', 'mogel');
    assert.eq({ border: '10', cat: 'mogel' }, item.css);
    Styling.remove(item, 'cat');
    assert.eq({ border: '10' }, item.css);
    assert.eq('10', Styling.get(item, 'border'));
  }
);
