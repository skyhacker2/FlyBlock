var Brick, BrickCache;

BrickCache = [];

Brick = GameObject.extend({
  _className: "Brick",
  ctor: function(type) {
    this._super();
    this.type = type;
    if (type.id !== BrickType.length - 1) {
      return this.initWithFile(type.textureName);
    } else {
      return this.initMonster();
    }
  },
  initMonster: function() {
    var animFrames, animation, f, frame, i, str, _i;
    frame = cc.spriteFrameCache.getSpriteFrame(this.type.textureName + "0001.png");
    this.setSpriteFrame(frame);
    animFrames = [];
    for (i = _i = 1; _i <= 12; i = ++_i) {
      str = this.type.textureName + (i < 10 ? "000" + i : "00" + i) + ".png";
      f = cc.spriteFrameCache.getSpriteFrame(str);
      animFrames.push(f);
    }
    animation = new cc.Animation(animFrames, 1.0 / 12.0);
    animation.setLoops(10000);
    animation.setRestoreOriginalFrame(true);
    return this.runAction(cc.animate(animation));
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
