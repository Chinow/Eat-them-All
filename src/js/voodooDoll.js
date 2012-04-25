
//-----------------------------------------------------------------------------
//	Constants
//-----------------------------------------------------------------------------

// Doll state
var STANDING = 1;
var WALKING = 2;
var SUMMONING = 3;

Crafty.c('VoodooDoll', {
	
	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	state: STANDING,
	lastDirection: NONE,
	popSign: 0,
	id: 0,
	master: null,
	pillar: null,
	defaultDirection: null,
	maxSigns: ETA.config.game.nbSign,
	actionKey: Crafty.keys.ENTER,
	HPLeft: ETA.config.game.fortress.hitPoints,
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
		this.defaultDirection = (playerId == 1) ? EAST : WEST;
		
		// Setup keyboard
		if (this.id == 1) {
			this.keyboard1Controls(ETA.config.game.doll.speed)
				.attr(ETA.config.p1.startPosition);
			
			this.actionKey = ETA.config.p1.actionKey;
		} else {
			this.keyboard2Controls(ETA.config.game.doll.speed)
				.attr(ETA.config.p2.startPosition);
			
			this.actionKey = ETA.config.p2.actionKey;
		}
		
		//Setup animation
		this.animate("stand_right", [[0,0],[14,0],[0,0],[15,0]])
		.animate("stand_left", [[3,0],[16,0],[3,0],[17,0]])
		.animate("stand_down", [[6,0],[18,0],[6,0],[19,0]])
		.animate("stand_up", [[9,0],[20,0],[9,0],[21,0]])
		.animate("walk_right", [[0,0],[1,0],[0,0],[2,0]])
		.animate("walk_left", [[3,0],[4,0],[3,0],[5,0]])
		.animate("walk_up", [[9,0],[10,0],[9,0],[11,0]])
		.animate("walk_down", [[6,0],[7,0],[6,0],[8,0]])
		.animate("summon_sign", [[12,0],[13,0],[13,0],[12,0],[0,0]])
		.bind("EnterFrame", function() {
			if (this.state == SUMMONING && !this.isPlaying("summon_sign")) {
				this.state = STANDING;
				this.stop().animate("stand_down", ETA.config.animation.doll.stand, -1);
			}
		})
		.bind("NewDirection", function (direction) {
			if (this.state != SUMMONING) {
				if (direction.y != 0) {
					this.state = WALKING;
					
					if (direction.y < 0 && !this.isPlaying("walk_up")) {
						this.lastDirection = NORTH;
						this.stop().animate("walk_up", ETA.config.animation.doll.walk, -1);
					} else if (direction.y > 0 && !this.isPlaying("walk_down")) {
						this.lastDirection = SOUTH;
						this.stop().animate("walk_down", ETA.config.animation.doll.walk, -1);
					}
				} else if (direction.x != 0) {
					this.state = WALKING;
					
					if (direction.x < 0 && !this.isPlaying("walk_left")) {
						this.lastDirection = WEST;
						this.stop().animate("walk_left", ETA.config.animation.doll.walk, -1);
					} else if (direction.x > 0 && !this.isPlaying("walk_right")) {
						this.lastDirection = EAST;
						this.stop().animate("walk_right", ETA.config.animation.doll.walk, -1);
					}
				} else if (this.state != STANDING) {
					this.state = STANDING;
					
					switch (this.lastDirection) {
						case NORTH:
							this.stop().animate("stand_up", ETA.config.animation.doll.stand, -1);
							break;
						case SOUTH:
							this.stop().animate("stand_down", ETA.config.animation.doll.stand, -1);
							break;
						case WEST:
							this.stop().animate("stand_left", ETA.config.animation.doll.stand, -1);
							break;
						case EAST:
							this.stop().animate("stand_right", ETA.config.animation.doll.stand, -1);
							break;
					}
				}
			}
		})
		.onHit("gridBounds", function () {
			//Move unit out of solid tile
		})
		.bind('Moved', function(from) {
			this.z = this.y;
			
			var collide = this.hit('dollGridBounds');
			
			// Cancel movement when colliding
			if (collide) {
				var collideLength = collide.length;
				for (var i = 0; i < collideLength; i++) {
					if (collide[i].type == "SAT") {
						this.attr({ x: from.x, y: from.y });
						return;
					}
				}
			}
			
			// Cancel movement when summoning signs
			if (this.state == SUMMONING) {
				this.attr({ x: from.x, y: from.y });
				return;
			}
		})
		.bind('KeyDown', function(el) {
			if (el.key == this.actionKey) {
				this.lastDirection = SOUTH;
				this.state = SUMMONING;
				this.stop().animate("summon_sign",  ETA.config.animation.doll.summon, 0);
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
		
		if (this.id == 1) {
			this.stop().animate("stand_right", ETA.config.animation.doll.stand, -1);
		} else {
			this.stop().animate("stand_left", ETA.config.animation.doll.stand, -1);		
		}
		
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Methods
	//-----------------------------------------------------------------------------
	
	drawSign : function(cell) {
		var signSprite = (this.id == 1) ? "redSign" : "blueSign";
		
		if (this.popSign < ETA.config.game.doll.maxSigns) {
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
