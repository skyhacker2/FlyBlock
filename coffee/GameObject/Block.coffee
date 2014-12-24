BlockCache = []
BlockState = 
	NONE: 0
	UP: 1
	DOWN: 2
Block = GameObject.extend
	_className: "Block"
	state: BlockState.NONE

	ctor: (type)->
		@_super("##{type.textureName}0001.png")
		@type = type
		@flippedX = true
		#@initWithFile "##{type.textureName}0001.png"
		@invincible = true
		@animation = null
		@initAnimation()
		@play()

	initAnimation: ()->
		animFrames = []
		for i in [1..12]
			str = @type.textureName + (if i < 10 then "000" + i else "00" + i) + ".png"
			frame = cc.spriteFrameCache.getSpriteFrame(str)
			animFrames.push frame
		animation = new cc.Animation animFrames, 1.0 / 12.0
		animation.setLoops 10000
		animation.setRestoreOriginalFrame true
		@animation = animation

	destroy: ()->
		@visible = false
		@active = false
		@invincible = true

	setState: (state)->
		@state = state

	play: ()->
		@stopActionByTag 1
		animate = cc.animate @animation
		animate.setTag 1
		@runAction animate

	changeType: (type)->
		@type = type
		frame = cc.spriteFrameCache.getSpriteFrame "#{type.textureName}0001.png"
		@setSpriteFrame frame
		@initAnimation()
		@play()

Block.getOrCreate = (type)->
	block = null
	for i in [0...BlockCache.length]
		block = BlockCache[i]
		if not block.visible and block.type.id is type.id
			block.visible = true
			block.active = true
			return block
	return Block.create type

Block.create = (type)->
	block = new Block(type)
	BlockCache.push(block)
	return block

Block.cleanCache = ()->
	BlockCache = []