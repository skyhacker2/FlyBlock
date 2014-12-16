FloatFloatBlock = GameObject.extend
	_className: "FloatBlock"
	cache: []

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

FloatBlock.getOrCreate = (type)->
	FloatBlock = null
	for i in [0...FloatBlock.cache.length]
		FloatBlock = FloatBlock.cache[i]
		if not FloatBlock.visible and FloatBlock.type.id is type.id
			FloatBlock.visible = true
			FloatBlock.active = true
			return FloatBlock
	return FloatBlock.create type

FloatBlock.create = (type)->
	FloatBlock = new FloatBlock(type)
	FloatBlock.cache.push(FloatBlock)
	return FloatBlock

FloatBlock.cleanCache = ()->
	FloatBlock.cache = []