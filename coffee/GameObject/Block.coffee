BlockCache = []
BlockState = 
	NONE: 0
	UP: 1
	DOWN: 2
Block = GameObject.extend
	_className: "Block"
	state: BlockState.NONE

	ctor: (type)->
		@_super()
		@type = type
		@initWithFile type.textureName
		@invincible = true

	destroy: ()->
		@visible = false
		@active = false
		@invincible = true

	setState: (state)->
		@state = state

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