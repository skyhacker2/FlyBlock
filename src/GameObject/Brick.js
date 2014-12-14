var Brick, BrickCache;

BrickCache = [];

Brick = GameObject.extend({
  _className: "Brick",
  ctor: function() {
    this._super();
    return this.initWithFile("res/brick.png");
  },
  destroy: function() {
    this.active = false;
    return this.visible = false;
  }
});

Brick.create = function() {
  var brick;
  brick = new Brick();
  BrickCache.push(brick);
  return brick;
};

Brick.getOrCreate = function() {
  var brick, i, _i, _ref;
  brick = null;
  for (i = _i = 0, _ref = BrickCache.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    brick = BrickCache[i];
    if (!brick.visible) {
      return brick;
    }
  }
  return Brick.create();
};
