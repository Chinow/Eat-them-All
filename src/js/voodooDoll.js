Crafty.c('VoodooDoll', {
	
	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	walking: "none",
	popSign: 0,
	id: 0,
	master: null,
	pillar : null,
	maxSigns: ETA.config.game.nbSign,
	actionKey: Crafty.keys.ENTER,
	HPLeft: ETA.config.game.hitPointsFortress,
	statistics: {
		zombiesSpawned: 0,
		guardsKilled: 0,
		citiesControlled: 0,
		citiesDestroyed: 0
	},
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, Collision, Controls")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
		this._globalZ = 8;
	},
	
	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	VoodooDoll: function(playerId) {
		this.id = playerId;
		
		// Setup keyboard
		if (this.id == 1) {
			this.keyboard1Controls(ETA.config.game.dollSpeed)
				.attr(ETA.config.p1.startPosition);
			
			this.actionKey = ETA.config.p1.actionKey;
		} else {
			this.keyboard2Controls(ETA.config.game.dollSpeed)
				.attr(ETA.config.p2.startPosition);
			
			this.actionKey = ETA.config.p2.actionKey;
		}
		
		//Setup animation
		this.animate("walk_right", [[0,0],[1,0],[0,0],[2,0]])
		.animate("walk_left", [[3,0],[4,0],[3,0],[5,0]])
		.animate("walk_up", [[9,0],[10,0],[9,0],[11,0]])
		.animate("walk_down", [[6,0],[7,0],[6,0],[8,0]])
		.animate("summon_sign", [[12,0],[13,0],[13,0],[12,0],[0,0]])
		//Change direction when 
		.bind("NewDirection", function (direction) {
			var rate = ETA.config.frameRate/ETA.config.dollAnimationRate;
			if (!this.isPlaying("summon_sign")) {
				if (direction.y != 0) {
					if (direction.y < 0 && !this.isPlaying("walk_up")) {
						this.stop().animate("walk_up", rate, -1);
						this.walking = "up";
					} else if (direction.y > 0 && !this.isPlaying("walk_down")) {
						this.stop().animate("walk_down", rate, -1);
						this.walking = "down";
					}
				} else if (direction.x != 0) {
					if (direction.x < 0 && !this.isPlaying("walk_left")) {
						this.stop().animate("walk_left", rate, -1);
						this.walking = "left";
					} else if (direction.x > 0 && !this.isPlaying("walk_right")) {
						this.stop().animate("walk_right", rate, -1);
						this.walking = "right";
					}
				} else {
					this.stop();
					this.walking = "none"
				}
			}
		})
		.onHit("gridBounds", function () {
			//Move unit out of solid tile
		})
		.bind('Moved', function(from) {
			var collide = this.hit('dollGridBounds');
			if (collide) {
				var collideLength = collide.length;
				for (var i = 0; i < collideLength; i++) {
					if (collide[i].type == "SAT") {
						this.attr({ x: from.x, y: from.y });
					}
				}
			}
			
			this.z = this.y;
			
			if (this.isPlaying("summon_sign")) {
				this.attr({ x: from.x, y: from.y });
				return;
			}
		})
		.bind('KeyDown', function(el) {
			if (el.key == this.actionKey) {
				var rate = ETA.config.frameRate / ETA.config.dollAnimationRate;
				this.stop().animate("summon_sign", rate, 0);
				this.master.summon();
				var cell = ETA.grid.getCell(this._x + 29, this._y + 48);
				
				if (cell.elem == null) {
					this.drawSign(cell);
				} else if (cell.elem.type == SIGN && this.id == cell.elem.player.id) {
					cell.elem.rotateSign();
				} else if (cell.elem.type == CITY && cell.elem.player != null && this.id == cell.elem.player.id) {
					cell.elem.switchDoorState();
				}
			}
		});
		
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Methods
	//-----------------------------------------------------------------------------
	
	drawSign : function(cell) {
		var signSprite = (this.id == 1) ? "signRougeSprite" : "signBleuSprite";
		
		if (this.popSign < ETA.config.game.nbSign) {
			Crafty.e("Sign, " + signSprite).attr({
				x: cell.center.x - 10,
				y: cell.center.y - 35,
				z: cell.center.y - 35,
				w: 65,
				h: 65
			}).sign(this);
		}
	},
	
	youLose : function() {
		Crafty.stop(true);
		Crafty("2D DOM").destroy();
		Crafty.init(ETA.config.stageWidth, ETA.config.stageHeight, ETA.config.frameRate);
		Crafty.sprite(16, "img/bgSprite.png", {
			bg: [0, 0,1000 ,550]
		});
		ETA.grid = Crafty.e("BGGrid").gridGameOver(this);
		gameState = STOPPED;
	}
});
