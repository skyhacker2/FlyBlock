var BaseLayer;

BaseLayer = cc.Layer.extend({
  _className: "BaseLayer",
  _winSize: 0,
  ctor: function() {
    this._super();
    return this._winSize = cc.winSize;
  },
  setBackground: function(rs) {
    var bgSprite;
    bgSprite = new cc.Sprite(rs);
    bgSprite.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
    return this.addChild(bgSprite);
  }
});
