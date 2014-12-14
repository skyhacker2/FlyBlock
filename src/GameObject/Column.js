var Column, ColumnCache;

ColumnCache = [];

Column = GameObject.extend({
  _className: "Cloumn",
  ctor: function(type) {
    this._super();
    this.initWithFile(type.textureName);
    return this.type = type;
  },
  destroy: function() {
    this.visible = false;
    return this.active = false;
  }
});

Column.getOrCreate = function(type) {
  var column, i, _i, _ref;
  column = null;
  for (i = _i = 0, _ref = ColumnCache.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
    column = ColumnCache[i];
    if (!column.visible && column.type.id === type.id) {
      column.active = true;
      column.visible = true;
      return column;
    }
  }
  return Column.create(type);
};

Column.create = function(type) {
  var column;
  column = new Column(type);
  ColumnCache.push(column);
  return column;
};

Column.cleanCache = function() {
  return ColumnCache = [];
};
