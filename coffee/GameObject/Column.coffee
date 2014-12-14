ColumnCache = []
Column = GameObject.extend
	_className: "Cloumn"

	ctor: (type)->
		@_super()
		# cc.log type.textureName
		@initWithFile type.textureName
		@type = type

	destroy: ()->
		@visible = false
		@active = false

Column.getOrCreate = (type)->
	#cc.log type
	#cc.log type.textureName
	column = null
	for i in [0...ColumnCache.length]
		column = ColumnCache[i]
		if not column.visible and column.type.id is type.id
			column.active = true
			column.visible = true
			return column

	return Column.create type

Column.create = (type)->
	column = new Column(type)
	ColumnCache.push column
	return column

Column.cleanCache = ()->
	ColumnCache = []