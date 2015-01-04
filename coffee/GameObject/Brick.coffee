BrickCache = []
Brick = GameObject.extend
	_className: "Brick"

	ctor: (type)->
		@_super()
		@type = type
		@init()

	init: ()->
		frame = cc.spriteFrameCache.getSpriteFrame @type.textureName + "0001.png"
		@setSpriteFrame frame
		animFrames = []
		for i in [1..12]
			str = @type.textureName + (if i < 10 then "000" + i else "00" + i) + ".png"
			f = cc.spriteFrameCache.getSpriteFrame str
			animFrames.push f
		animation = new cc.Animation animFrames, 1.0 / 12.0
		animation.setLoops 10000
		animation.setRestoreOriginalFrame true
		@runAction cc.animate animation

	destroy: ()->
		@active = false
		@visible = false

Brick.create = (type)->
	brick = new Brick(type)
	BrickCache.push brick
	return brick

Brick.getOrCreate = (type)->
	brick = null
	for i in [0...BrickCache.length]
		brick = BrickCache[i]
		if not brick.visible
			brick.visible = true
			brick.active = true
			return brick
	return Brick.create(type)

Brick.cleanCache = ()->
	BrickCache = []