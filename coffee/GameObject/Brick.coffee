BrickCache = []
Brick = GameObject.extend
	_className: "Brick"

	ctor: ()->
		@_super()
		@initWithFile "res/brick.png"

	destroy: ()->
		@active = false
		@visible = false

Brick.create = ()->
	brick = new Brick()
	BrickCache.push brick
	return brick

Brick.getOrCreate = ()->
	brick = null
	for i in [0...BrickCache.length]
		brick = BrickCache[i]
		if not brick.visible
			return brick
	return Brick.create()