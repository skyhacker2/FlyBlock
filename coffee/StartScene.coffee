StartLayer = BaseLayer.extend
	_className: "StartLayer"
	startBtn: null
	teachBtn: null
	rateBtn: null
	ctor: ()->
		@_super()
		@setBackground("res/start_page.png")

		# startBtn = @startBtn = new ccui.Button()
		# startBtn.setTouchEnabled(true)
		# startBtn.setPressedActionEnabled(true)
		# startBtn.loadTextures("res/start_btn.png")
		# startBtn.x = @_winSize.width * 0.8
		# startBtn.y = @_winSize.height * 0.3
		# startBtn.addTouchEventListener (sender, type)=>
		# 	switch type
		# 		when ccui.Widget.TOUCH_ENDED
		# 			MyLoaderScene.preload g_gameScene, ()->
		# 				cc.director.runScene new GameScene()
		# , @
		# @addChild startBtn

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
			x: @_winSize.width * 0.8
			y: @_winSize.height * 0.3
			callback: (sender, type)->
				switch type
					when ccui.Widget.TOUCH_ENDED
						cc.log 'touch end'
						cc.LoaderScene.preload g_gameScene, ()->
							cc.log 'preload complete'
							cc.director.runScene new GameScene()
						, @
			target: @
		@addButton
			normalImage: "res/teach_btn.png"
			x: @_winSize.width * 0.7
			y: @_winSize.height * 0.2
			callback: (sender, type)->
				switch type
					when ccui.Widget.TOUCH_ENDED
						cc.LoaderScene.preload g_teachScene, ()->
							cc.director.runScene new TeachScene()
						, @
			target: @

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



StartScene = cc.Scene.extend
	onEnter: ()->
		@_super()
		layer = new StartLayer()
		@addChild layer
