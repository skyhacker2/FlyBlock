var Effect;

Effect = {};

Effect.columnCollEffect = function(target, pos) {
  var action, aniFrames, animate, animation, effect, frame, i, onComplete, str, _i;
  effect = new cc.Sprite("#texiao0001.png");
  animation = cc.animationCache.getAnimation("ColumnCollEffect");
  if (!animation) {
    aniFrames = [];
    str = "";
    for (i = _i = 1; _i <= 11; i = ++_i) {
      str = "texiao00" + (i < 10 ? "0" + i : i) + ".png";
      frame = cc.spriteFrameCache.getSpriteFrame(str);
      aniFrames.push(frame);
    }
    animation = new cc.Animation(aniFrames, 1.0 / 24.0);
    cc.animationCache.addAnimation("ColumnCollEffect");
  }
  animate = new cc.Animate(animation);
  target.addChild(effect);
  effect.setPosition(pos);
  onComplete = cc.callFunc(function() {
    return this.parent.removeChild(this, true);
  }, effect);
  action = cc.sequence(animate, onComplete);
  return effect.runAction(action);
};
