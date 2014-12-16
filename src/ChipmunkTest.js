var ChipmunkTest;

ChipmunkTest = ChipmunkLayer.extend({
  _className: "ChipmunkTest",
  ctor: function() {
    this._super();
    return this.initPhysics();
  },
  onEnter: function() {
    this._super();
    cc.log("" + this._className + " onEnter");
    this.scheduleUpdate();
    cc.eventManager.addListener({
      event: cc.EventListener.MOUSE,
      onMouseDown: (function(_this) {
        return function(event) {
          return _this.sprite1.runAction(cc.moveTo(1, cc.p(event._x, event._y)));
        };
      })(this)
    }, this);
    return this.space.addCollisionHandler(1, 2, this.collisionBegin.bind(this), this.collisionPre.bind(this), this.collisionPost.bind(this), this.collisionSeparate.bind(this));
  },
  onExit: function() {
    this.space.removeCollisionHandler(1, 2);
    this._super();
    return cc.log("" + this._className + " onExit");
  },
  initPhysics: function() {
    this.space.gravity = cp.v(0, 0);
    this.space.iterations = 20;
    this.sprite1 = this.createPhysicsSprite(cc.p(this._winSize.width / 2, this._winSize.height / 2), "res/fly_blue.png", 1, false);
    this.addChild(this.sprite1);
    this.sprite1.runAction(cc.rotateTo(1, 45));
    this.sprite2 = this.createPhysicsSprite(cc.p(this._winSize.width / 2, this._winSize.height * 0.2), "res/column_blue.png", 2, true);
    return this.addChild(this.sprite2);
  },
  createPhysicsSprite: function(pos, file, collisionType, isStaticShape) {
    var body, shape, sprite;
    sprite = new cc.Sprite(file);
    sprite.setPosition(pos);
    cc.log(sprite.width);
    if (isStaticShape) {
      body = new cp.Body(Infinity, cp.momentForBox(1, sprite.width, sprite.height));
      body.setPos(pos);
      this.space.addBody(body);
      shape = new cp.BoxShape(body, sprite.width, sprite.height);
      shape.setCollisionType(collisionType);
      this.space.addStaticShape(shape);
    } else {
      body = new cp.Body(1, cp.momentForBox(1, sprite.width, sprite.height));
      body.setPos(pos);
      this.space.addBody(body);
      shape = new cp.BoxShape(body, sprite.width, sprite.height);
      shape.setCollisionType(collisionType);
      this.space.addShape(shape);
    }
    sprite.body = body;
    return sprite;
  },
  collisionBegin: function(arbiter, space) {
    var collTypeA, collTypeB, label, shapes;
    if (this.messageDisplayed) {
      label = new cc.LabelBMFont("Collision Detected", "res/font.fnt");
      this.addChild(label);
      label.x = this._winSize.width / 2;
      label.y = this._winSize.height / 2;
      this.messageDisplayed = true;
    }
    cc.log('collision begin');
    shapes = arbiter.getShapes();
    collTypeA = shapes[0].collision_type;
    collTypeB = shapes[1].collision_type;
    cc.log('collision type a: ' + collTypeA);
    return cc.log('collision type b: ' + collTypeB);
  },
  collisionPre: function(arbiter, space) {
    cc.log('collision pre');
    return true;
  },
  collisionPost: function(arbiter, space) {
    return cc.log('collision post');
  },
  collisionSeparate: function(arbiter, space) {
    return cc.log('collision separate');
  },
  update: function(dt) {
    this.space.step(dt);
    return this.sprite2.rotation = 0;
  }
});

ChipmunkTest.scene = function() {
  var scene;
  scene = new cc.Scene();
  scene.addChild(new ChipmunkTest());
  return scene;
};
