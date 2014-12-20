var StartLayer, StartScene;

StartLayer = BaseLayer.extend({
  _className: "StartLayer",
  startBtn: null,
  teachBtn: null,
  rateBtn: null,
  ctor: function() {
    this._super();
    this.setBackground("res/start_page.png");
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
      x: this._winSize.width * 0.8,
      y: this._winSize.height * 0.3,
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
      target: this
    });
    this.addButton({
      normalImage: "res/teach_btn.png",
      x: this._winSize.width * 0.7,
      y: this._winSize.height * 0.2,
      callback: function(sender, type) {
        switch (type) {
          case ccui.Widget.TOUCH_ENDED:
            return cc.LoaderScene.preload(g_teachScene, function() {
              return cc.director.runScene(new TeachScene());
            }, this);
        }
      },
      target: this
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
    var button;
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
    return this.addChild(button);
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
