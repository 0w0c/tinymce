test(
  'UpTest',

  [
    'ephox.boss.mutant.Locator',
    'ephox.boss.mutant.Tracks',
    'ephox.boss.mutant.Up',
    'ephox.compass.Arr',
    'ephox.perhaps.Option'
  ],

  function (Locator, Tracks, Up, Arr, Option) {

    var family = Tracks.track({
      id: 'A',
      name: '_A_',
      children: [
        { id: 'B', name: '_B_', children: [ ] },
        { id: 'C', name: '_C_', children: [
          { id: 'D', name: '_D_', children: [
            { id: 'E', name: '_E_', children: [] }
          ]},
          { id: 'F', name: '_F_', children: [] }
        ]}
      ]
    }, Option.none());

    var d = Locator.byId(family, 'D').getOrDie();
    assert.eq('A', Up.selector(d, '_A_').getOrDie().id);
    assert.eq('C', Up.selector(d, '_C_').getOrDie().id);
    assert.eq('C', Up.selector(d, '_C_,_A_').getOrDie().id);
    assert.eq('C', Up.selector(d, '_B_,_C_,_A_').getOrDie().id);
    assert.eq('C', Up.selector(d, '_B_,_A_,_C_').getOrDie().id);
    assert.eq(true, Up.selector(d, '_B_,_Z_').isNone());

    assert.eq('A', Up.predicate(d, function (item) {
      return item.id === 'A';
    }).getOrDie().id);

    assert.eq(true, Up.predicate(d, function (item) {
      return item.id === 'root';
    }).isNone());

    var checkAll = function (expected, start) {
      var item = Locator.byId(family, start).getOrDie();
      var result = Up.all(item);
      assert.eq(expected, Arr.map(result, function (r) {
        return r.id;
      }).join(','));
    };

    checkAll('D,C,A', 'E');
    checkAll('C,A', 'F');
    checkAll('', 'A');
    checkAll('A', 'B');

    assert.eq('A', Up.top(d).id);
  }
);
