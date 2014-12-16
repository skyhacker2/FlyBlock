var FloatFloatBlock;

FloatFloatBlock = GameObject.extend({
  _className: "FloatBlock",
  cache: [],
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
  }
});

FloatBlock.getOrCreate = function(type) {
  var FloatBlock, i, _i, _ref;
  FloatBlock = null;
  for (i = _i = 0, _ref = FloatBlock.cache.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    FloatBlock = FloatBlock.cache[i];
    if (!FloatBlock.visible && FloatBlock.type.id === type.id) {
      FloatBlock.visible = true;
      FloatBlock.active = true;
      return FloatBlock;
    }
  }
  return FloatBlock.create(type);
};

FloatBlock.create = function(type) {
  var FloatBlock;
  FloatBlock = new FloatBlock(type);
  FloatBlock.cache.push(FloatBlock);
  return FloatBlock;
};

FloatBlock.cleanCache = function() {
  return FloatBlock.cache = [];
};
