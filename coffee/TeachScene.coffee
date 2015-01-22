TeachLayer = BaseLayer.extend
	_className: "TeachLayer"

	teachSprites: []

	ctor: ()->
		@_super()
		@index = 0
		pos = cc.p(@_winSize.width/2, @_winSize.height/2)
		for i in [1..7]
			sprite = new cc.Sprite "res/teach#{i}.png"
			sprite.setPosition pos
			@teachSprites.push sprite
			@addChild sprite
			pos.x += sprite.getContentSize().width

		#触摸事件
		#destop
		if cc.sys.capabilities.hasOwnProperty('mouse')
			cc.eventManager.addListener
				event: cc.EventListener.MOUSE
				onMouseDown: (event)=> 
					if @index is @teachSprites.length-1
						if event._x > @_winSize.width * 0.3 and event._x < @_winSize.width * 0.6
							cc.LoaderScene.preload g_gameScene, ()->
								cc.director.runScene new GameScene()
					if event._x > @_winSize.width/2
						@slideToNext()
					else
						@slideToPrev()
				, @
		#device
		if cc.sys.capabilities.hasOwnProperty 'touches'
			cc.eventManager.addListener
				event: cc.EventListener.TOUCH_ONE_BY_ONE
				swallowTouches: true
				onTouchBegan: (touch, event)->
					return true
				onTouchEnded: (touch, event)=>
					pos = touch.getLocation()
					if @index is @teachSprites.length-1
						if pos.x > @_winSize.width * 0.3 and pos.x < @_winSize.width * 0.6
							cc.LoaderScene.preload g_gameScene, ()->
								cc.director.runScene new GameScene()
					if pos.x > @_winSize.width/2
						@slideToNext()
					else
						@slideToPrev()
				, @
	slideToPrev: ()->
		if @index is 0
			return
		@stopAllActions()
		@index--
		@runAction cc.moveTo 0.2, cc.p(-@_winSize.width * @index, 0)

	slideToNext: ()->
		if @index is @teachSprites.length-1
			return
		@stopAllActions()
		@index++
		@runAction cc.moveTo 0.2, cc.p(-@_winSize.width * @index, 0)

TeachScene = cc.Scene.extend
	onEnter: ()->
		@_super()
		layer = new TeachLayer()
		@addChild layer