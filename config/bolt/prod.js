configure({
  sources: [
    source('amd', 'ephox.phoenix', '../../src/main/js', mapper.hierarchical),
    source('amd', 'ephox', '../../lib/run/depend', mapper.flat)
  ]
});
