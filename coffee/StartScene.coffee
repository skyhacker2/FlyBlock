StartLayer = BaseLayer.extend
	_className: "StartLayer"
	startBtn: null
	teachBtn: null
	rateBtn: null
	ctor: ()->
		@_super()
		@setBackground("res/start_page.jpg")

		if cc.sys.capabilities.hasOwnProperty "keyboard"
			cc.eventManager.addListener
				event: cc.EventListener.KEYBOARD
				onKeyPressed: (key, evnet)->
					cc.log 'key pressed ' + key
				onKeyReleased: (key, event)->
					cc.log "key pressed #{key}"
					if key is 6
						cc.director.end()
			, @

		@addButton
			normalImage: "res/start_btn.png"
			x: @_winSize.width * 0.5
			y: @_winSize.height * 0.5
			callback: (sender, type)->
				switch type
					when ccui.Widget.TOUCH_ENDED
						cc.log 'touch end'
						cc.LoaderScene.preload g_gameScene, ()->
							cc.log 'preload complete'
							cc.director.runScene new GameScene()
						, @
			target: @
			delay: 0
		@addButton
			normalImage: "res/teach_btn.png"
			x: @_winSize.width * 0.5
			y: @_winSize.height * 0.35
			callback: (sender, type)->
				switch type
					when ccui.Widget.TOUCH_ENDED
						cc.LoaderScene.preload g_teachScene, ()->
							cc.director.runScene new TeachScene()
						, @
			target: @
			delay: 0.2

		if cc.sys.isNative
			@addButton
				normalImage: "res/rate_btn.png"
				x: @_winSize.width * 0.5
				y: @_winSize.height * 0.1
				callback: (sender, type)->
					switch type
						when ccui.Widget.TOUCH_ENDED
							jsb.reflection.callStaticMethod G.JAVA_CLASS,
								"rateApp", "()V"
				target: @


	addButton: (opt)->
		cc.log 'addButton'
		#button = new ccui.Button.create(opt.normalImage, opt.selectedImage, opt.disableImage)
		button = new ccui.Button()
		button.loadTextureNormal(opt.normalImage)
		button.setTouchEnabled(true)
		button.setPressedActionEnabled(true)
		button.x = opt.x or 0
		button.y = opt.y or 0
		button.addTouchEventListener opt.callback, opt.target if opt.callback
		@addChild button
		button.setScale 0 # 缩小
		# 放大动画
		scaleTo1 = cc.scaleTo 0.1, 1.2
		scaleTo2 = cc.scaleTo 0.08, 0.9
		scaleTo3 = cc.scaleTo 0.08, 1.1
		scaleTo4 = cc.scaleTo 0.08, 1
		delay = cc.delayTime opt.delay
		button.runAction cc.sequence(delay, scaleTo1, scaleTo2, scaleTo3, scaleTo4)



StartScene = cc.Scene.extend
	onEnter: ()->
		@_super()
		layer = new StartLayer()
		@addChild layer
