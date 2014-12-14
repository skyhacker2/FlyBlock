GameLayer = BaseLayer.extend
	_className: "GameLayer"
	_bgNum: 3
	_bgRes: ["res/level_bg1.png", "res/level_bg2.png", "res/level_bg3.png"]
	_cloudRes: ["res/level_cloud1.png", "res/level_cloud2.png", "res/level_cloud3.png"]
	a: 9.8 # 加速度
	v0: 10 # 初速度
	time: 0 # 时间
	# v = v0 + at

	ctor: ()->
		@_super()
		cc.log "#{@_className} ctor"
		
		@_bgIndex = 0
		@_cloudLayers = []
		@_columns = []
		@_columnNum = 0
		@_score = 0
		@_gameTime = 0
		@_invincibleTime = 0
		@_gameOver = false
		@_blockQueue = []
		@_bricks = [] # 砖块
		@_floatBlocks = [] # 漂浮方块

		@_bgIndex = getRandomInt(0, @_bgNum)
		@setBackground(@_bgRes[@_bgIndex])

		@createUI()

		#触摸事件
		#destop
		if cc.sys.capabilities.hasOwnProperty('mouse')
			cc.eventManager.addListener
				event: cc.EventListener.MOUSE
				onMouseDown: => 
					@touch()
				, @
		#device
		if cc.sys.capabilities.hasOwnProperty 'touches'
			cc.eventManager.addListener
				event: cc.EventListener.TOUCH_ONE_BY_ONE
				swallowTouches: true
				onTouchBegan: ()->
					return true
				onTouchEnded: =>
					@touch()
				, @

	createUI: ()->
		#云层
		w = 0
		for i in [0..1]
			cloudLayer = new cc.Layer()
			cloudLayer.setPosition w, 0
			cloud = new cc.Sprite @_cloudRes[@_bgIndex]
			cloud.attr
				anchorX: 0
				anchorY: 0
				x: 0
				y: 0

			cloudLayer.addChild cloud
			cloudLayer.setContentSize cloud.getContentSize()
			@_cloudLayers.push cloudLayer
			@addChild cloudLayer
			w += cloud.getContentSize().width

		@_addColumn()

		# 分数
		@_label = new cc.LabelTTF("0", "Ariel", 100)
		@_label.attr
			x: @_winSize.width * 0.5
			y: @_winSize.height * 0.8
		@addChild @_label, 10

		# 方块
		for i in [0...5]
			@_blockQueue.push(BlockType[getRandomInt(0, BlockType.length)])

		blockType = BlockType[getRandomInt(0, BlockType.length)]
		block = @block = Block.getOrCreate blockType
		block.attr
			x: @_winSize.width * 0.5,
			y: @_winSize.height * 0.7
		@addChild block, 2

		board = @scoreBoard = new cc.Sprite "res/score_board.png"
		board.x = @_winSize.width/2
		board.y = -board.getContentSize().height/2
		@addChild board, 5

		againBtn = @againBtn = new ccui.Button()
		againBtn.loadTextures 'res/again_btn.png'
		againBtn.setTouchEnabled true
		againBtn.setPressedActionEnabled true
		againBtn.x = @_winSize.width * 0.3
		againBtn.y = -againBtn.getContentSize().height/2
		againBtn.addTouchEventListener (sender, type)=>
			MyLoaderScene.preload g_gameScene, ()->
				cc.director.runScene new GameScene()
			, @
		@addChild againBtn, 5

		shareBtn = @shareBtn = new ccui.Button()
		shareBtn.loadTextures 'res/share_btn.png'
		shareBtn.setTouchEnabled true
		shareBtn.setPressedActionEnabled true
		shareBtn.x = @_winSize.width * 0.7
		shareBtn.y = -shareBtn.getContentSize().height/2
		@addChild shareBtn, 5


	touch: ()->
		if @_gameOver
			return
		@block.stopAllActions()
		@block.state = BlockState.UP
		time = 0.2
		action = cc.sequence cc.spawn(cc.rotateTo(time, -30),
			cc.moveTo(time, cc.pAdd(@block.getPosition(), cc.p(0, 70)))
			), cc.callFunc ()=>
				#cc.log 'cc.callFunc'
				@block.state = BlockState.DOWN
				@block.runAction(cc.rotateTo(time, 30))
				@time = 0

		@block.runAction action

	onEnter: ()->
		@_super()
		@scheduleUpdate()

	onExit: ()->
		cc.log 'onExit'
		Block.cleanCache()
		Column.cleanCache()
		@_super()

	update: (dt)->
		@_gameTime += dt
		if not @_gameOver
			@_updateCloudLayer(dt)
			@_moveColumn(dt)
			@_addColumn(dt)
			@_moveBrick(dt)
			@_addBrick(dt)
			@_updateBlock(dt)
			@_checkIsCollide(dt)
		else
			@unscheduleUpdate()

	_updateCloudLayer: (dt)->
		for layer in @_cloudLayers
			do (layer)->
				pos = layer.getPosition()
				layer.setPosition cc.p(pos.x - G.CLOUD_MOVE_INTERVAL, 0)
				if layer.getPosition().x + layer.getContentSize().width < 0
					layer.setPosition cc.p(layer.getContentSize().width, 0)
		return 0

	_moveColumn: (dt)->
		for c in @_columns
			do(c)->
				pos = c.getPosition()
				c.setPosition cc.p(pos.x - G.MOVE_INTERVAL, pos.y)

		if @_columns[0].getPosition().x + @_columns[0].getContentSize().width/2 < 0
			@_columns[0].destroy()
			@_columnNum--
			@_columns.shift()

	_addColumn: (dt)->
		if @_columnNum < G.ColumnNum
			type = getRandomInt 0, ColumnType.length
			# 判断是否给之前颜色相同
			if @_columnNum > 0 and ColumnType[type].id is @_columns[@_columnNum-1].type.id
				@_addColumn()
			else
				column = Column.getOrCreate ColumnType[type]
				size = column.getContentSize()
				height = getRandomInt -size.height * 0.3, size.height/2
				x = if @_columnNum > 0 then @_columns[@_columnNum-1].getPosition().x else -size.width # 最后的一个column的x坐标或者0

				column.setPosition cc.p(x + size.width, height)
				@_columns.push column
				if not column.getParent()
					@addChild column, 3
				@_columnNum++
				@_addColumn()

	# 添加砖块
	_addBrick: (dt)->
		if @_bricks.length > G.BRICK_NUM
			return
		brick = Brick.create()
		pos = cc.p(@_winSize.width + 100, @_winSize.height * 0.7)
		randomX = getRandomInt(200, 600)
		randomY = getRandomInt(@_winSize.height/2, @_winSize.height * 0.9)
		if @_bricks.length > 0
			pos = @_bricks[@_bricks.length-1].getPosition()
		pos.x += randomX
		pos.y = randomY
		brick.setPosition pos
		@addChild brick
		@_bricks.push brick

	_moveBrick: (dt)->
		for c in @_bricks
			do(c)->
				pos = c.getPosition()
				c.setPosition cc.p(pos.x - G.MOVE_INTERVAL, pos.y)

		if @_bricks.length > 0 and @_bricks[0].getPosition().x + @_bricks[0].getContentSize().width/2 < 0
			@_bricks[0].destroy()
			@_bricks.shift()

	_updateBlock: (dt)->
		if @block.invincible
			@_invincibleTime += dt
			if @_invincibleTime > G.INVINCIBLE_TIME
				@block.opacity = 255
				@block.invincible = false
			else
				if not @block.isFadein
					@block.opacity = if @block.opacity - 10 < 100 then 100 else @block.opacity -= 10
					@block.isFadein = true if @block.opacity is 100
				else
					@block.opacity = if @block.opacity + 10 > 255 then 255 else @block.opacity += 10
					@block.isFadein = false if @block.opacity is 255
		if @block.state is BlockState.NONE
			return
		else if @block.state is BlockState.DOWN
			@time += dt
			v = @v0 + @a * @time * G.PTM_RATIO
			@block.setPosition cc.pSub @block.getPosition(), cc.p(0, v * dt)
			return

	_checkIsCollide: ()->
		column = null
		for i in [0...@_columns.length]
			column = @_columns[i]
			rect = column.getBoundingBox()
			blockRect = @block.getBoundingBox()
			# 四个点
			p1 = cc.p(cc.rectGetMinX(blockRect), cc.rectGetMinY(blockRect))
			p2 = cc.p(cc.rectGetMaxX(blockRect), cc.rectGetMinY(blockRect))
			p3 = cc.p(cc.rectGetMinX(blockRect), cc.rectGetMaxY(blockRect))
			p4 = cc.p(cc.rectGetMaxX(blockRect), cc.rectGetMaxY(blockRect))
			if cc.rectContainsPoint(rect, @block.getPosition())
				cc.log "碰撞啦"
				if @block.type.id isnt column.type.id
					@_gameOver = true
					@gameOver()
				else
					cc.log "Bingo"
					@_score++
					@_label.setString(@_score)
					@block.destroy()
					@_nextBlock()
				return
		# 砖块的碰撞
		if not @block.invincible
			dis = @block.width
			# cc.log "dis #{dis}"
			for brick in @_bricks
				do(brick)=>
					d = Math.sqrt(Math.pow(@block.x - brick.x, 2) + Math.pow(@block.y - brick.y, 2))
					# cc.log "d #{d}"
					if d < dis
						@_gameOver = true
						@gameOver()

	_nextBlock: ()->
		@_invincibleTime = 0
		type = @_blockQueue.shift()
		@_blockQueue.push BlockType[getRandomInt(0, BlockType.length)]
		block = @block = Block.getOrCreate type
		block.setPosition @_winSize.width/2, @_winSize.height
		block.state = BlockState.DOWN
		if not block.getParent()
			@addChild block, 2

	gameOver: ()->
		@scoreBoard.runAction cc.sequence cc.delayTime(0.2),
			cc.moveTo(0.3, cc.p(@_winSize.width/2, @_winSize.height*0.65))

		@againBtn.runAction cc.sequence cc.delayTime(0.5),
			cc.moveTo(0.3, cc.p(@_winSize.width * 0.3, @_winSize.height*0.45))

		@shareBtn.runAction cc.sequence cc.delayTime(0.5),
			cc.moveTo(0.3, cc.p(@_winSize.width*0.7, @_winSize.height*0.45))

		@_label.visible = false
		scoreLabel = new cc.LabelBMFont("#{@_score}",  "res/font.fnt");
		scoreLabel.x = 170
		scoreLabel.y = 115
		scoreLabel.anchorX = 0
		@scoreBoard.addChild scoreLabel

		timeLabel = new cc.LabelBMFont(formatTime(@_gameTime), "res/font.fnt")
		timeLabel.x = 170
		timeLabel.y = 45
		timeLabel.anchorX = 0
		@scoreBoard.addChild timeLabel


GameScene = cc.Scene.extend
	onEnter: ()->
		@_super()
		layer = new GameLayer()
		@addChild layer