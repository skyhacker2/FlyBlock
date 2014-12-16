MyLoaderScene = cc.Scene.extend
	_interval: null
	_label: null
	_className: "LoaderScene"

	ctor: ()->
		@_super()
		@init()

	init: ()->
		size = cc.winSize
		@_bgLayer = new cc.Layer()
		# bgSprite = new cc.Sprite("res/start_page_bg.png")
		# bgSprite.attr
		# 	x: size.width / 2
		# 	y: size.height / 2
		# @_bgLayer.addChild bgSprite

		label = @_label = new cc.LabelTTF "Loading... 0%", "Arial", 40
		label.setPosition cc.p(size.width/2, 200)
		label.setColor cc.color(180, 180, 180)
		@_bgLayer.addChild(@_label)

		@addChild @_bgLayer

	onEnter: ()->
		cc.log "#{@_className} onEnter"
		@_super()
		@schedule(@_startLoading, 0.3)

	onExit: ()->
		cc.log "#{@_className} onExit"
		@_super()

	initWithResources: (resources, cb)->
		cc.log resources
		if cc.isString(resources)
			resources = [resources]
		@resources = resources or []
		@cb = cb

	_startLoading: ()->
		@unschedule(@_startLoading)
		res = @resources
		cc.loader.load res, 
			(result, count, loadedCount)=>
				percent = (loadedCount / count * 100) | 0
				percent = Math.min(percent, 100)
				@_label.setString("Loading...#{percent}%")
			, ()=>
				@cb() if @cb

MyLoaderScene.preload = (resources, cb)->
	cc.log i for i in resources
	if not MyLoaderScene._loaderScene
		MyLoaderScene._loaderScene = new MyLoaderScene()

	MyLoaderScene._loaderScene.initWithResources(resources, cb)
	cc.director.runScene(MyLoaderScene._loaderScene)
