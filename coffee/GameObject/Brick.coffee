BrickCache = []
Brick = GameObject.extend
	_className: "Brick"

	ctor: (type)->
		@_super()
		@initWithFile type.textureName

		@type = type

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