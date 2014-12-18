var MyLoaderScene;

MyLoaderScene = cc.Scene.extend({
  _interval: null,
  _label: null,
  _className: "LoaderScene",
  ctor: function() {
    this._super();
    return this.init();
  },
  init: function() {
    var label, size;
    size = cc.winSize;
    this._bgLayer = new cc.Layer();
    label = this._label = new cc.LabelTTF("Loading... 0%", "Arial", 40);
    label.setPosition(cc.p(size.width / 2, 200));
    label.setColor(cc.color(180, 180, 180));
    this._bgLayer.addChild(this._label);
    return this.addChild(this._bgLayer);
  },
  onEnter: function() {
    cc.log("" + this._className + " onEnter");
    this._super();
    return this.schedule(this._startLoading, 0.3);
  },
  onExit: function() {
    cc.log("" + this._className + " onExit");
    return this._super();
  },
  initWithResources: function(resources, cb) {
    cc.log(resources);
    if (cc.isString(resources)) {
      resources = [resources];
    }
    this.resources = resources || [];
    return this.cb = cb;
  },
  _startLoading: function() {
    var res;
    this.unschedule(this._startLoading);
    res = this.resources;
    return cc.loader.load(res, (function(_this) {
      return function(result, count, loadedCount) {
        var percent;
        percent = (loadedCount / count * 100) | 0;
        percent = Math.min(percent, 100);
        return _this._label.setString("Loading..." + percent + "%");
      };
    })(this), (function(_this) {
      return function() {
        if (_this.cb) {
          return _this.cb();
        }
      };
    })(this));
  }
});

MyLoaderScene.preload = function(resources, cb) {
  var i, _i, _len;
  for (_i = 0, _len = resources.length; _i < _len; _i++) {
    i = resources[_i];
    cc.log(i);
  }
  MyLoaderScene._loaderScene = new MyLoaderScene();
  MyLoaderScene._loaderScene.initWithResources(resources, cb);
  return cc.director.runScene(MyLoaderScene._loaderScene);
};
