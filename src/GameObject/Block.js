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
    this._super();
    this.type = type;
    this.initWithFile(type.textureName);
    return this.invincible = true;
  },
  destroy: function() {
    this.visible = false;
    this.active = false;
    return this.invincible = true;
  },
  setState: function(state) {
    return this.state = state;
  },
  changeType: function(type) {
    this.type = type;
    return this.setTexture(type.textureName);
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
