ChipmunkTest = ChipmunkLayer.extend
	_className: "ChipmunkTest"

	ctor: ()->
		@_super()
		@initPhysics()

	onEnter: ()->
		@_super()
		cc.log "#{@_className} onEnter"
		@scheduleUpdate()

		cc.eventManager.addListener
			event: cc.EventListener.MOUSE
			onMouseDown: (event)=> 
				# @sprite1.x = event._x
				# @sprite1.y = event._y
				@sprite1.runAction cc.moveTo(1, cc.p(event._x, event._y))
				#@sprite1.runAction cc.rotateTo(1, 45)
			, @
		@space.addCollisionHandler( 1, 2,
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
            );

	onExit: ()->
		@space.removeCollisionHandler( 1, 2 );
		@_super()
		cc.log "#{@_className} onExit"


	initPhysics: ()->
		@space.gravity = cp.v(0, 0)
		@space.iterations = 20

		@sprite1 = @createPhysicsSprite cc.p(@_winSize.width/2, @_winSize.height/2),
			"res/fly_blue.png",
			1, false
		@addChild @sprite1
		@sprite1.runAction cc.rotateTo 1, 45

		@sprite2 = @createPhysicsSprite cc.p(@_winSize.width/2, @_winSize.height * 0.2),
			"res/column_blue.png",
			2, true
		@addChild @sprite2

	createPhysicsSprite: (pos, file, collisionType, isStaticShape)->
		sprite = new cc.Sprite file
		sprite.setPosition pos
		cc.log sprite.width
		if isStaticShape
			body = new cp.Body Infinity, cp.momentForBox(1, sprite.width, sprite.height)
			body.setPos pos
			@space.addBody body
			shape = new cp.BoxShape body, sprite.width, sprite.height
			shape.setCollisionType collisionType
			@space.addStaticShape shape
		else
			body = new cp.Body 1, cp.momentForBox(1, sprite.width, sprite.height)
			body.setPos pos
			@space.addBody body
			shape = new cp.BoxShape body, sprite.width, sprite.height
			shape.setCollisionType collisionType
			@space.addShape shape
		sprite.body = body
		return sprite

	collisionBegin: (arbiter, space)->
		if @messageDisplayed
			label = new cc.LabelBMFont "Collision Detected", "res/font.fnt"
			@addChild label
			label.x = @_winSize.width/2
			label.y = @_winSize.height/2
			@messageDisplayed = true
		cc.log 'collision begin'
		shapes = arbiter.getShapes()
		collTypeA = shapes[0].collision_type
		collTypeB = shapes[1].collision_type
		cc.log 'collision type a: ' + collTypeA
		cc.log 'collision type b: ' + collTypeB

	collisionPre: (arbiter, space)->
		cc.log 'collision pre'
		return true
	collisionPost: (arbiter, space)->
		cc.log 'collision post'
	collisionSeparate: (arbiter, space)->
		cc.log 'collision separate'

	update: (dt)->
		@space.step dt
		@sprite2.rotation = 0

ChipmunkTest.scene = ()->
	scene = new cc.Scene()
	scene.addChild new ChipmunkTest()
	return scene