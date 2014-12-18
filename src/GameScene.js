var GameLayer, GameScene;

GameLayer = BaseLayer.extend({
  _className: "GameLayer",
  _bgNum: 3,
  _bgRes: ["res/level_bg1.png", "res/level_bg2.png", "res/level_bg3.png"],
  _cloudRes: ["res/level_cloud1.png", "res/level_cloud2.png", "res/level_cloud3.png"],
  a: 9.8,
  v0: 10,
  time: 0,
  ctor: function() {
    this._super();
    cc.log("" + this._className + " ctor");
    this._bgIndex = 0;
    this._cloudLayers = [];
    this._columns = [];
    this._columnNum = 0;
    this._score = 0;
    this._gameTime = 0;
    this._invincibleTime = 0;
    this._gameOver = false;
    this._blockQueue = [];
    this._bricks = [];
    this._floatBlocks = [];
    this._bgIndex = getRandomInt(0, this._bgNum);
    this.setBackground(this._bgRes[this._bgIndex]);
    this.createUI();
    if (cc.sys.capabilities.hasOwnProperty('mouse')) {
      cc.eventManager.addListener({
        event: cc.EventListener.MOUSE,
        onMouseDown: (function(_this) {
          return function() {
            return _this.touch();
          };
        })(this)
      }, this);
    }
    if (cc.sys.capabilities.hasOwnProperty('touches')) {
      return cc.eventManager.addListener({
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,
        onTouchBegan: (function(_this) {
          return function() {
            _this.touch();
            return true;
          };
        })(this)
      }, this);
    }
  },
  createUI: function() {
    var againBtn, block, blockType, board, cloud, cloudLayer, i, shareBtn, w, _i, _j;
    w = 0;
    for (i = _i = 0; _i <= 1; i = ++_i) {
      cloudLayer = new cc.Layer();
      cloudLayer.setPosition(w, 0);
      cloud = new cc.Sprite(this._cloudRes[this._bgIndex]);
      cloud.attr({
        anchorX: 0,
        anchorY: 0,
        x: 0,
        y: 0
      });
      cloudLayer.addChild(cloud);
      cloudLayer.setContentSize(cloud.getContentSize());
      this._cloudLayers.push(cloudLayer);
      this.addChild(cloudLayer);
      w += cloud.getContentSize().width;
    }
    this._addColumn();
    this._label = new cc.LabelTTF("0", "Ariel", 100);
    this._label.attr({
      x: this._winSize.width * 0.5,
      y: this._winSize.height * 0.8
    });
    this.addChild(this._label, 10);
    for (i = _j = 0; _j < 5; i = ++_j) {
      this._blockQueue.push(BlockType[getRandomInt(0, BlockType.length)]);
    }
    blockType = BlockType[getRandomInt(0, BlockType.length)];
    block = this.block = Block.getOrCreate(blockType);
    block.attr({
      x: this._winSize.width * 0.5,
      y: this._winSize.height * 0.7
    });
    this.addChild(block, 2);
    board = this.scoreBoard = new cc.Sprite("res/score_board.png");
    board.x = this._winSize.width / 2;
    board.y = -board.getContentSize().height / 2;
    this.addChild(board, 5);
    againBtn = this.againBtn = new ccui.Button();
    againBtn.loadTextureNormal('res/again_btn.png');
    againBtn.setTouchEnabled(true);
    againBtn.setPressedActionEnabled(true);
    againBtn.x = this._winSize.width * 0.3;
    againBtn.y = -againBtn.getContentSize().height / 2;
    againBtn.addTouchEventListener((function(_this) {
      return function(sender, type) {
        switch (type) {
          case ccui.Widget.TOUCH_ENDED:
            MyLoaderScene.preload(g_gameScene, function() {});
            return cc.director.runScene(new GameScene());
        }
      };
    })(this), this);
    this.addChild(againBtn, 5);
    shareBtn = this.shareBtn = new ccui.Button();
    shareBtn.loadTextureNormal('res/share_btn.png');
    shareBtn.setTouchEnabled(true);
    shareBtn.setPressedActionEnabled(true);
    shareBtn.x = this._winSize.width * 0.7;
    shareBtn.y = -shareBtn.getContentSize().height / 2;
    shareBtn.addTouchEventListener((function(_this) {
      return function(sender, type) {
        switch (type) {
          case ccui.Widget.TOUCH_ENDED:
            if (!cc.sys.isNative) {
              _this.addChild(new ShareUI(), 100);
              if (_this._score > 0) {
                return share(1, _this._score);
              } else {
                return share(0);
              }
            } else {
              return cc.log('实现原生分享');
            }
        }
      };
    })(this), this);
    return this.addChild(shareBtn, 5);
  },
  touch: function() {
    var action, now, time;
    if (this._gameOver) {
      return;
    }
    now = this._gameTime;
    cc.audioEngine.playEffect("res/touch.mp3");
    this.block.stopAllActions();
    this.block.state = BlockState.UP;
    time = 0.2;
    action = cc.sequence(cc.spawn(cc.rotateTo(time, -15), cc.moveTo(time, cc.pAdd(this.block.getPosition(), cc.p(0, 70)))), cc.callFunc((function(_this) {
      return function() {
        _this.block.state = BlockState.DOWN;
        _this.block.runAction(cc.rotateTo(time, 15));
        return _this.time = 0;
      };
    })(this)));
    return this.block.runAction(action);
  },
  onEnter: function() {
    this._super();
    this.scheduleUpdate();
    if (cc.audioEngine.preloadEffect) {
      return cc.audioEngine.preloadEffect("res/touch.mp3");
    }
  },
  onExit: function() {
    cc.log('onExit');
    Block.cleanCache();
    Column.cleanCache();
    Brick.cleanCache();
    return this._super();
  },
  update: function(dt) {
    this._gameTime += dt;
    if (!this._gameOver) {
      this._updateCloudLayer(dt);
      this._moveColumn(dt);
      this._addColumn(dt);
      this._moveBrick(dt);
      this._addBrick(dt);
      this._updateBlock(dt);
      return this._checkIsCollide(dt);
    } else {
      return this.unscheduleUpdate();
    }
  },
  _updateCloudLayer: function(dt) {
    var layer, _fn, _i, _len, _ref;
    _ref = this._cloudLayers;
    _fn = function(layer) {
      var pos;
      pos = layer.getPosition();
      layer.setPosition(cc.p(pos.x - G.CLOUD_MOVE_INTERVAL * dt, 0));
      if (layer.getPosition().x + layer.getContentSize().width < 0) {
        return layer.setPosition(cc.p(layer.getContentSize().width, 0));
      }
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      layer = _ref[_i];
      _fn(layer);
    }
    return 0;
  },
  _moveColumn: function(dt) {
    var c, _fn, _i, _len, _ref;
    _ref = this._columns;
    _fn = function(c) {
      var pos;
      pos = c.getPosition();
      return c.setPosition(cc.p(pos.x - G.MOVE_INTERVAL * dt, pos.y));
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      _fn(c);
    }
    if (this._columns[0].getPosition().x + this._columns[0].getContentSize().width / 2 < 0) {
      this._columns[0].destroy();
      this._columnNum--;
      return this._columns.shift();
    }
  },
  _addColumn: function(dt) {
    var column, height, size, type, x;
    if (this._columnNum < G.ColumnNum) {
      type = getRandomInt(0, ColumnType.length);
      if (this._columnNum > 0 && ColumnType[type].id === this._columns[this._columnNum - 1].type.id) {
        return this._addColumn();
      } else {
        column = Column.getOrCreate(ColumnType[type]);
        size = column.getContentSize();
        height = getRandomInt(-size.height * 0.3, size.height / 2);
        x = this._columnNum > 0 ? this._columns[this._columnNum - 1].getPosition().x : -size.width;
        column.setPosition(cc.p(x + size.width, height));
        this._columns.push(column);
        if (!column.getParent()) {
          this.addChild(column, 3);
        }
        this._columnNum++;
        return this._addColumn();
      }
    }
  },
  _addBrick: function(dt) {
    var brick, num, pos, randomX, randomY, type;
    if (this._bricks.length > G.BRICK_NUM) {
      return;
    }
    num = getRandomInt(0, 9);
    if (num < 3) {
      type = BrickType[getRandomInt(0, BrickType.length - 1)];
    } else {
      type = BrickType[8];
    }
    brick = Brick.getOrCreate(type);
    pos = cc.p(this._winSize.width + 100, this._winSize.height * 0.7);
    randomX = getRandomInt(400, 700);
    randomY = getRandomInt(this._winSize.height / 2, this._winSize.height * 0.9);
    if (this._bricks.length > 0) {
      pos = this._bricks[this._bricks.length - 1].getPosition();
    }
    pos.x += randomX;
    pos.y = randomY;
    brick.setPosition(pos);
    if (!brick.getParent()) {
      this.addChild(brick);
    }
    return this._bricks.push(brick);
  },
  _moveBrick: function(dt) {
    var c, _fn, _i, _len, _ref;
    _ref = this._bricks;
    _fn = function(c) {
      var pos;
      pos = c.getPosition();
      return c.setPosition(cc.p(pos.x - G.MOVE_INTERVAL * dt, pos.y));
    };
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      _fn(c);
    }
    if (this._bricks.length > 0 && this._bricks[0].getPosition().x + this._bricks[0].getContentSize().width / 2 < 0) {
      this._bricks[0].destroy();
      return this._bricks.shift();
    }
  },
  _updateBlock: function(dt) {
    var v;
    if (this.block.invincible) {
      this._invincibleTime += dt;
      if (this._invincibleTime > G.INVINCIBLE_TIME) {
        this.block.opacity = 255;
        this.block.invincible = false;
      } else {
        if (!this.block.isFadein) {
          this.block.opacity = this.block.opacity - 10 < 100 ? 100 : this.block.opacity -= 10;
          if (this.block.opacity === 100) {
            this.block.isFadein = true;
          }
        } else {
          this.block.opacity = this.block.opacity + 10 > 255 ? 255 : this.block.opacity += 10;
          if (this.block.opacity === 255) {
            this.block.isFadein = false;
          }
        }
      }
    }
    if (this.block.state === BlockState.NONE) {

    } else if (this.block.state === BlockState.DOWN) {
      this.time += dt;
      v = this.v0 + this.a * this.time * G.PTM_RATIO;
      this.block.setPosition(cc.pSub(this.block.getPosition(), cc.p(0, v * dt)));
    }
  },
  _checkIsCollide: function() {
    var blockRect, brick, column, dis, i, pos, rect, _i, _j, _len, _ref, _ref1, _results;
    column = null;
    pos = this.block.getPosition();
    blockRect = cc.rect(pos.x - 40, pos.y - 40, 90, 90);
    for (i = _i = 0, _ref = this._columns.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
      column = this._columns[i];
      rect = column.getBoundingBox();
      if (cc.rectContainsPoint(rect, this.block.getPosition()) || cc.rectIntersectsRect(rect, blockRect)) {
        cc.log("碰撞啦");
        if (this.block.type.id !== column.type.id) {
          this._gameOver = true;
          this.gameOver();
        } else {
          cc.log("Bingo");
          cc.audioEngine.playEffect('res/score.mp3');
          this._score++;
          this._label.setString(this._score);
          this.block.destroy();
          this._nextBlock();
        }
        return;
      }
    }
    if (!this.block.invincible) {
      dis = this.block.width;
      _ref1 = this._bricks;
      _results = [];
      for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
        brick = _ref1[_j];
        _results.push((function(_this) {
          return function(brick) {
            if (cc.rectIntersectsRect(brick.getBoundingBox(), blockRect)) {
              if (brick.type.id === 8) {
                _this._gameOver = true;
                return _this.gameOver();
              } else {
                _this.block.changeType(BlockType[brick.type.id]);
                _this.block.invincible = true;
                _this._invincibleTime = 0;
                return brick.destroy();
              }
            }
          };
        })(this)(brick));
      }
      return _results;
    }
  },
  _nextBlock: function() {
    var block, type;
    this._invincibleTime = 0;
    type = this._blockQueue.shift();
    this._blockQueue.push(BlockType[getRandomInt(0, BlockType.length)]);
    block = this.block = Block.getOrCreate(type);
    block.setPosition(this._winSize.width / 2, this._winSize.height);
    block.state = BlockState.DOWN;
    if (!block.getParent()) {
      return this.addChild(block, 2);
    }
  },
  gameOver: function() {
    var scoreLabel, timeLabel;
    this.scoreBoard.runAction(cc.sequence(cc.delayTime(0.2), cc.moveTo(0.3, cc.p(this._winSize.width / 2, this._winSize.height * 0.65))));
    this.againBtn.runAction(cc.sequence(cc.delayTime(0.5), cc.moveTo(0.3, cc.p(this._winSize.width * 0.3, this._winSize.height * 0.45))));
    this.shareBtn.runAction(cc.sequence(cc.delayTime(0.5), cc.moveTo(0.3, cc.p(this._winSize.width * 0.7, this._winSize.height * 0.45))));
    this._label.visible = false;
    scoreLabel = new cc.LabelBMFont("" + this._score, "res/font.fnt");
    scoreLabel.x = 170;
    scoreLabel.y = 115;
    scoreLabel.anchorX = 0;
    this.scoreBoard.addChild(scoreLabel);
    timeLabel = new cc.LabelBMFont(formatTime(this._gameTime), "res/font.fnt");
    timeLabel.x = 170;
    timeLabel.y = 45;
    timeLabel.anchorX = 0;
    return this.scoreBoard.addChild(timeLabel);
  }
});

GameScene = cc.Scene.extend({
  onEnter: function() {
    var layer;
    this._super();
    layer = new GameLayer();
    return this.addChild(layer);
  }
});
