var ChipmunkLayer;

ChipmunkLayer = BaseLayer.extend({
  _className: "ChipmukLayer",
  ctor: function() {
    this._super();
    this.space = new cp.Space();
    this.setupDebugNode();
    return this.toggleDebug();
  },
  setupDebugNode: function() {
    this._debugNode = new cc.PhysicsDebugNode(this.space);
    this._debugNode.visible = false;
    return this.addChild(this._debugNode, 100);
  },
  toggleDebug: function() {
    var state;
    state = this._debugNode.visible;
    return this._debugNode.visible = !state;
  },
  onEnter: function() {
    return this._super();
  },
  onExit: function() {
    this._super();
    return this.unscheduleUpdate();
  },
  initPhysics: function(gX, gY, iterations) {
    this.space.gravity = cp.v(gX, gY);
    return this.space.iterations = iterations;
  }
});
