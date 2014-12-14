var TeachLayer, TeachScene;

TeachLayer = BaseLayer.extend({
  _className: "TeachLayer",
  teachSprites: [],
  ctor: function() {
    var i, pos, sprite, _i;
    this._super();
    this.index = 0;
    pos = cc.p(this._winSize.width / 2, this._winSize.height / 2);
    for (i = _i = 1; _i <= 8; i = ++_i) {
      sprite = new cc.Sprite("res/teach" + i + ".png");
      sprite.setPosition(pos);
      this.teachSprites.push(sprite);
      this.addChild(sprite);
      pos.x += sprite.getContentSize().width;
    }
    if (cc.sys.capabilities.hasOwnProperty('mouse')) {
      cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseDown: (function(_this) {
          return function(event) {
            if (_this.index === _this.teachSprites.length - 1) {
              if (event._x > _this._winSize.width * 0.3 && event._x < _this._winSize.width * 0.6) {
                MyLoaderScene.preload(g_gameScene, function() {
                  return cc.director.runScene(new GameScene());
                });
              }
            }
            if (event._x > _this._winSize.width / 2) {
              return _this.slideToNext();
            } else {
              return _this.slideToPrev();
            }
          };
        })(this)
      }, this);
    }
    if (cc.sys.capabilities.hasOwnProperty('touches')) {
      return cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: function(touch, event) {
          return true;
        },
        onTouchEnded: (function(_this) {
          return function(touch, event) {
            pos = touch.getLocation();
            if (_this.index === _this.teachSprites.length - 1) {
              if (pos.x > _this._winSize.width * 0.3 && pos.x < _this._winSize.width * 0.6) {
                MyLoaderScene.preload(g_gameScene, function() {
                  return cc.director.runScene(new GameScene());
                });
              }
            }
            if (pos.x > _this._winSize.width / 2) {
              return _this.slideToNext();
            } else {
              return _this.slideToPrev();
            }
          };
        })(this)
      }, this);
    }
  },
  slideToPrev: function() {
    if (this.index === 0) {
      return;
    }
    this.stopAllActions();
    this.index--;
    return this.runAction(cc.moveTo(0.2, cc.p(-this._winSize.width * this.index, 0)));
  },
  slideToNext: function() {
    if (this.index === this.teachSprites.length - 1) {
      return;
    }
    this.stopAllActions();
    this.index++;
    return this.runAction(cc.moveTo(0.2, cc.p(-this._winSize.width * this.index, 0)));
  }
});

TeachScene = cc.Scene.extend({
  onEnter: function() {
    var layer;
    this._super();
    layer = new TeachLayer();
    return this.addChild(layer);
  }
});
