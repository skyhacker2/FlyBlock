var Brick, BrickCache;

BrickCache = [];

Brick = GameObject.extend({
  _className: "Brick",
  ctor: function(type) {
    this._super();
    this.initWithFile(type.textureName);
    return this.type = type;
  },
  destroy: function() {
    this.active = false;
    return this.visible = false;
  }
});

Brick.create = function(type) {
  var brick;
  brick = new Brick(type);
  BrickCache.push(brick);
  return brick;
};

Brick.getOrCreate = function(type) {
  var brick, i, _i, _ref;
  brick = null;
  for (i = _i = 0, _ref = BrickCache.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    brick = BrickCache[i];
    if (!brick.visible) {
      brick.visible = true;
      brick.active = true;
      return brick;
    }
  }
  return Brick.create(type);
};

Brick.cleanCache = function() {
  return BrickCache = [];
};
