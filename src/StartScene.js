var StartLayer, StartScene;

StartLayer = BaseLayer.extend({
  _className: "StartLayer",
  startBtn: null,
  teachBtn: null,
  rateBtn: null,
  ctor: function() {
    this._super();
    this.setBackground("res/start_page.jpg");
    if (cc.sys.capabilities.hasOwnProperty("keyboard")) {
      cc.eventManager.addListener({
        event: cc.EventListener.KEYBOARD,
        onKeyPressed: function(key, evnet) {
          return cc.log('key pressed ' + key);
        },
        onKeyReleased: function(key, event) {
          cc.log("key pressed " + key);
          if (key === 6) {
            return cc.director.end();
          }
        }
      }, this);
    }
    this.addButton({
      normalImage: "res/start_btn.png",
      x: this._winSize.width * 0.5,
      y: this._winSize.height * 0.5,
      callback: function(sender, type) {
        switch (type) {
          case ccui.Widget.TOUCH_ENDED:
            cc.log('touch end');
            return cc.LoaderScene.preload(g_gameScene, function() {
              cc.log('preload complete');
              return cc.director.runScene(new GameScene());
            }, this);
        }
      },
      target: this,
      delay: 0
    });
    this.addButton({
      normalImage: "res/teach_btn.png",
      x: this._winSize.width * 0.5,
      y: this._winSize.height * 0.35,
      callback: function(sender, type) {
        switch (type) {
          case ccui.Widget.TOUCH_ENDED:
            return cc.LoaderScene.preload(g_teachScene, function() {
              return cc.director.runScene(new TeachScene());
            }, this);
        }
      },
      target: this,
      delay: 0.2
    });
    if (cc.sys.isNative) {
      return this.addButton({
        normalImage: "res/rate_btn.png",
        x: this._winSize.width * 0.5,
        y: this._winSize.height * 0.1,
        callback: function(sender, type) {
          switch (type) {
            case ccui.Widget.TOUCH_ENDED:
              return jsb.reflection.callStaticMethod(G.JAVA_CLASS, "rateApp", "()V");
          }
        },
        target: this
      });
    }
  },
  addButton: function(opt) {
    var button, delay, scaleTo1, scaleTo2, scaleTo3, scaleTo4;
    cc.log('addButton');
    button = new ccui.Button();
    button.loadTextureNormal(opt.normalImage);
    button.setTouchEnabled(true);
    button.setPressedActionEnabled(true);
    button.x = opt.x || 0;
    button.y = opt.y || 0;
    if (opt.callback) {
      button.addTouchEventListener(opt.callback, opt.target);
    }
    this.addChild(button);
    button.setScale(0);
    scaleTo1 = cc.scaleTo(0.1, 1.2);
    scaleTo2 = cc.scaleTo(0.08, 0.9);
    scaleTo3 = cc.scaleTo(0.08, 1.1);
    scaleTo4 = cc.scaleTo(0.08, 1);
    delay = cc.delayTime(opt.delay);
    return button.runAction(cc.sequence(delay, scaleTo1, scaleTo2, scaleTo3, scaleTo4));
  }
});

StartScene = cc.Scene.extend({
  onEnter: function() {
    var layer;
    this._super();
    layer = new StartLayer();
    return this.addChild(layer);
  }
});
