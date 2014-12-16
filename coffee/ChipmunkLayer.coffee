ChipmunkLayer = BaseLayer.extend
	_className: "ChipmukLayer"

	ctor: ()->
		@_super()
		#Create the initial space
		@space = new cp.Space()

		@setupDebugNode();
		@toggleDebug()

	setupDebugNode: ()->
		#debug only
        @_debugNode = new cc.PhysicsDebugNode(@space )
        @_debugNode.visible = false
        @addChild @_debugNode, 100

    toggleDebug: ()->
    	state = @_debugNode.visible
    	@_debugNode.visible = not state

    onEnter: ()->
    	@_super()

    onExit: ()->
    	@_super()
    	@unscheduleUpdate()

    initPhysics: (gX, gY, iterations)->
    	@space.gravity = cp.v(gX, gY)
    	@space.iterations = iterations