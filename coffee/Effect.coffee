Effect = {}
Effect.columnCollEffect = (target, pos)->
    effect = new cc.Sprite "#texiao0001.png"
    animation = cc.animationCache.getAnimation "ColumnCollEffect"
    if not animation
        aniFrames = []
        str = ""
        for i in [1..11]
            str = "texiao00" +  (if i < 10 then "0#{i}" else i) + ".png"
            frame = cc.spriteFrameCache.getSpriteFrame str
            aniFrames.push frame
        animation = new cc.Animation aniFrames, 1.0 / 24.0
        cc.animationCache.addAnimation "ColumnCollEffect"
    animate = new cc.Animate animation
    target.addChild effect
    effect.setPosition pos

    onComplete = cc.callFunc ()->
        @.parent.removeChild @, true
    , effect

    action = cc.sequence animate, onComplete
    effect.runAction action


