test(
  'SharedTest',

  [
    'ephox.boss.api.Gene',
    'ephox.boss.api.TestUniverse',
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Option',
    'ephox.robin.parent.Shared'
  ],

  function (Gene, TestUniverse, Arr, Option, Shared) {
    var data = TestUniverse(Gene('root', 'root', [
      Gene('1', 'div', [
        Gene('1.1', 'p', [
          Gene('1.1.1', 'text', [])
        ]),
        Gene('1.2', 'ol', [
          Gene('1.2.1', 'li', [
            Gene('1.2.1.1', 'text', []),
            Gene('1.2.1.2', 'span', [
              Gene('1.2.1.2.1', 'text', [])
            ]),
            Gene('1.2.1.3', 'text', [])
          ]),
          Gene('1.2.2', 'li', [
            Gene('1.2.2.1', 'text', [])
          ])
        ]),
        Gene('1.3', 'p', [
          Gene('1.3.1', 'text', [])
        ])
      ]),
      Gene('2', 'div', [
        Gene('2.1', 'blockquote', [
          Gene('2.1.1', 'text', [])
        ])
      ])
    ]));

    var checker = function (target, ids, f) {
      var items = Arr.map(ids, function (id) {
        return data.find(data.get(), id).getOrDie();
      });

      var look = function (universe, item) {
        return item.name === target ? Option.some(item) : data.up().selector(item, target);
      };

      f(look, items);
    };

    var checkNone = function (target, ids) {
      checker(target, ids, function (look, items) {
        var actual = Shared.oneAll(data, look, items);
        assert.eq(true, actual.isNone());
      });
    };

    var check = function (expected, target, ids) {
      checker(target, ids, function (look, items) {
        var actual = Shared.oneAll(data, look, items).getOrDie();
        assert.eq(expected, actual.id);
      });
    };

    checkNone('li', [ '1.3.1' ]);
    checkNone('p', [ '1.1.1', '1.3.1' ]);
    check('1.2', 'ol', [ '1.2.2.1', '1.2.1.2' ]);

  }
);
