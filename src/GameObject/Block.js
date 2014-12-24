var Block, BlockCache, BlockState;

BlockCache = [];

BlockState = {
  NONE: 0,
  UP: 1,
  DOWN: 2
};

Block = GameObject.extend({
  _className: "Block",
  state: BlockState.NONE,
  ctor: function(type) {
    this._super("#" + type.textureName + "0001.png");
    this.type = type;
    this.flippedX = true;
    this.invincible = true;
    this.animation = null;
    this.initAnimation();
    return this.play();
  },
  initAnimation: function() {
    var animFrames, animation, frame, i, str, _i;
    animFrames = [];
    for (i = _i = 1; _i <= 12; i = ++_i) {
      str = this.type.textureName + (i < 10 ? "000" + i : "00" + i) + ".png";
      frame = cc.spriteFrameCache.getSpriteFrame(str);
      animFrames.push(frame);
    }
    animation = new cc.Animation(animFrames, 1.0 / 12.0);
    animation.setLoops(10000);
    animation.setRestoreOriginalFrame(true);
    return this.animation = animation;
  },
  destroy: function() {
    this.visible = false;
    this.active = false;
    return this.invincible = true;
  },
  setState: function(state) {
    return this.state = state;
  },
  play: function() {
    var animate;
    this.stopActionByTag(1);
    animate = cc.animate(this.animation);
    animate.setTag(1);
    return this.runAction(animate);
  },
  changeType: function(type) {
    var frame;
    this.type = type;
    frame = cc.spriteFrameCache.getSpriteFrame("" + type.textureName + "0001.png");
    this.setSpriteFrame(frame);
    this.initAnimation();
    return this.play();
  }
});

Block.getOrCreate = function(type) {
  var block, i, _i, _ref;
  block = null;
  for (i = _i = 0, _ref = BlockCache.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    block = BlockCache[i];
    if (!block.visible && block.type.id === type.id) {
      block.visible = true;
      block.active = true;
      return block;
    }
  }
  return Block.create(type);
};

Block.create = function(type) {
  var block;
  block = new Block(type);
  BlockCache.push(block);
  return block;
};

Block.cleanCache = function() {
  return BlockCache = [];
};
