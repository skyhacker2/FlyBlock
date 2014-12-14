BaseLayer = cc.Layer.extend
	_className: "BaseLayer"
	_winSize: 0
	ctor: ()->
		@_super()
		@_winSize = cc.winSize

	setBackground: (rs)->
		bgSprite = new cc.Sprite rs
		bgSprite.setPosition cc.winSize.width/2, cc.winSize.height/2
		@addChild bgSprite