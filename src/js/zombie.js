//-----------------------------------------------------------------------------
//	Constants
//-----------------------------------------------------------------------------

// Zombie states
var SPAWNING = 0;
var MOVING_OUT_OF_SPAWN = 1;
var MOVING = 2;
var ATTACKING = 3;
var DYING = 4;

//-----------------------------------------------------------------------------
//	Zombie object
//-----------------------------------------------------------------------------

Crafty.c('Zombie', {
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, zombi, Collision")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
        this._globalZ = 7;
	},
	
	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	targetPixel: { x: 500, y: 250 },
	currentCell: null,
	walkingDirection: NONE,
	state: SPAWNING,
	playerId: 0,
	animationRate: ETA.config.frameRate / ETA.config.zombiAnimationRate,
	attackRate: ETA.config.frameRate / ETA.config.zombiAttackAnimationRate,
	
	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	Zombie: function(playerId){
		this.playerId = playerId;
		this.walkingDirection = (playerId == 1) ? EAST : WEST;
		
		// Setup animation
		this.animate("spawn", [[12,0],[13,0],[14,0]])
		.animate("die", [[14,0],[13,0],[12,0]])
		.animate("walk_right", [[0,0],[1,0],[0,0],[2,0]])
		.animate("walk_left", [[3,0],[4,0],[3,0],[5,0]])
		.animate("walk_up", [[9,0],[10,0],[9,0],[11,0]])
		.animate("walk_down", [[6,0],[7,0],[6,0],[8,0]])
		.animate("attack_right", [[15,0], [16,0], [15,0], [17,0]])
		.animate("attack_left", [[18,0], [19,0], [18,0], [20,0]])
		.animate("attack_up", [[24,0], [25,0], [24,0], [26,0]])
		.animate("attack_down", [[21,0], [22,0], [21,0], [23,0]])
		.onHit("gridBounds", function () {
			//Move unit out of solid tile
		})
		.bind('Moved', function(from) {
			if (this.state != SPAWNING && this.state != DYING) {
				var collide = this.hit('gridBounds');
				if (collide) {
					var collideLength = collide.length;
					for (var i = 0; i < collideLength; i++) {
						if (collide[i].type == "SAT") {
							this.attr({ x: from.x, y: from.y });
						}
					}
				}	
			}
		})
		.bind("EnterFrame", this.moveZombi);
		
		this.animate("spawn", this.animationRate);
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Method - Move zombie
	//-----------------------------------------------------------------------------
	
	moveZombi: function() {
		// Finish the spawn and start moving
		if (this.state == SPAWNING && !this.isPlaying("spawn")) {
			this.state = MOVING_OUT_OF_SPAWN;
		}
		
		// Finish the attack and die
		if (this.state == ATTACKING
		&& !this.isPlaying("attack_right")
		&& !this.isPlaying("attack_left")
		&& !this.isPlaying("attack_up")
		&& !this.isPlaying("attack_down")) {
			this.die();
			return;
		}
		
		// Delete the sprite
		if (this.state == DYING && !this.isPlaying("die")) {
			this.destroy();
			return;
		}
		
		this.z = this.y;
		
		if (this.state == MOVING || this.state == MOVING_OUT_OF_SPAWN) {	
			if (!this.currentCell) {
				this.currentCell = ETA.grid.getCell(this.x + this.w/2 - 5, this.y + this.h/2+10);
			}
			
			var direction = {
				x: this.x + this.w / 2 - 5 - this.currentCell.center.x,
				y: this.y + this.h / 2 + 10 - this.currentCell.center.y
			};
			
			if (this.walkingDirection == WEST || this.walkingDirection == EAST) {
				if (direction.y > 1) {
					this.move(NORTH, 1);
				} else if (direction.y < -1) {
					this.move(SOUTH, 1);
				}
				
				var dx = this.x + this.w/2 -5 - this.currentCell.center.x
				if (dx < 5 && dx > -5) {
					var signPresent = false;
					var signDirection = NONE;
					
					if (this.currentCell.elemType == "sign" && this.currentCell.elem.direction != NONE
					&& this.currentCell.elem.player.id == this.playerId) {
						signPresent = true;
						signDirection =  this.currentCell.elem.direction;
					} else {
						var signPresent = false;
						var signDirection = NONE;
					}
					
					// Have sign
					if (signPresent) {
						// Sign and upper border
						if (!(this.currentCell.upperCell && signDirection == NORTH
						|| this.currentCell.lowerCell && signDirection == SOUTH)) {
							this.walkingDirection = signDirection;
						}
					}
				}
			} else {
				if (direction.x > 1) {
					this.move(WEST,1);
				} else if (direction.x < -1) {
					this.move(EAST,1);
				}
					
				var dy = this.y + this.h/2 + 10 - this.currentCell.center.y;
				
				if (dy < 5 && dy > -5) {
					if (this.currentCell.elemType == "sign" && this.currentCell.elem.direction != NONE
					&& this.currentCell.elem.player.id == this.playerId) {
						signPresent = true;
						signDirection =  this.currentCell.elem.direction;
					} else {
						var signPresent = false;
						var signDirection = NONE;
					}
					
					// Have sign
					if (signPresent) {
						// Sign and upper border
						if (this.currentCell.upperCell && signDirection == NORTH) {
							if (this.walkingDirection == NORTH) {
								this.walkingDirection = (Crafty.math.randomInt(1, 2) == 1) ? WEST : EAST;
							}
						}
						// Sign and lower border
						else if (this.currentCell.lowerCell && signDirection == SOUTH) {
							if (this.walkingDirection == SOUTH) {
								this.walkingDirection = (Crafty.math.randomInt(1, 2) == 1) ? WEST : EAST;
							}
						}
						// Sign
						else {
							this.walkingDirection = signDirection;
						}
					}
					// No sign
					else {
						// Upper border
						if (this.currentCell.upperCell && this.walkingDirection == NORTH) {
							this.walkingDirection = (Crafty.math.randomInt(1, 2) == 1) ? WEST : EAST;
						}
						// Lower border
						else if (this.currentCell.lowerCell && this.walkingDirection == SOUTH) {
							this.walkingDirection = (Crafty.math.randomInt(1, 2) == 1) ? WEST : EAST;
						}
					}
				}
			}
		
			// Attack fortress
			if (this.state == MOVING &&
			(this.currentCell.elemType == "fortress" || this.currentCell.elemType == "cemetery")) {
				if (this.playerId == this.currentCell.elem.player.id) {
					this.walkingDirection = (this.walkingDirection == EAST) ? WEST : EAST;
				} else{
					this.currentCell.elem.loseHP(ETA.config.game.zombiDamage);
					this.attack();
					return;
				}
			}
			
			if (this.currentCell.elemType == "city") {
				if (this.currentCell.elem.playerId != this.playerId) {
					// Attack city
					if (this.currentCell.elem.nbGards > 0) {
						this.currentCell.elem.loseGuard(1);
						this.attack();
						return;
					}
					// Invade city
					else {
						this.currentCell.elem.changePlayer(this.playerId);
						this.currentCell.elem.gainGuards(1);
						this.destroy();
						return;
					}
				}
				// Enforce city
				else if (this.playerId == this.currentCell.elem.playerId) {
					this.currentCell.elem.gainGuards(1);
					this.destroy();
					return;
				}
			}
			
			var collide = this.hit('gridBounds');
			var collided = false;
			
			if (collide) {
				var collideLength = collide.length;
				for (var i = 0; i < collideLength; i++) {
					if (collide[i].type == "SAT") {
						collided = true;
						break;
					}
				}
			}
			
			var collide2 = this.hit('zombi');
			var collided2 = false;
			if (collide2) {
				var collideLength = collide2.length;
				for (var i = 0; i < collideLength; i++) {
					if (collide2[i].type == "SAT") {
						if (collide2[i].obj.playerId != this.playerId) {
							if (this.state == MOVING && collide2[i].obj.state == MOVING) {
								collide2[i].obj.attack();
								this.attack();
								return;
							}
						}
					}
				}
			}
			
			if (!collided) {
				this.move(this.walkingDirection, ETA.config.game.zombiSpeed);
				
				if (this.walkingDirection == WEST && !this.isPlaying("walk_left")) {
					this.stop().animate("walk_left", this.animationRate, -1);
				} else if (this.walkingDirection == EAST && !this.isPlaying("walk_right")) {
					this.stop().animate("walk_right", this.animationRate, -1);
				} else if (this.walkingDirection == NORTH && !this.isPlaying("walk_up")) {
					this.stop().animate("walk_up", this.animationRate, -1);
				} else if (this.walkingDirection == SOUTH && !this.isPlaying("walk_down")) {
					this.stop().animate("walk_down", this.animationRate, -1);
				}
			}
			
			var newCell = ETA.grid.getCell(this.x + this.w/2, this.y + this.h/2);
			if (newCell != this.currentCell) {
				if (this.state == MOVING_OUT_OF_SPAWN) {
					this.state = MOVING;
				}
				
				this.currentCell = newCell;
			}
		}
	},
	
	//-----------------------------------------------------------------------------
	//	Method - Attack
	//-----------------------------------------------------------------------------
	
	attack: function() {
		this.state = ATTACKING;
		
		if (this.walkingDirection == WEST) {
			this.stop().animate("attack_left", this.attackRate);
		} else if (this.walkingDirection == EAST){
			this.stop().animate("attack_right", this.attackRate);
		} else if (this.walkingDirection == NORTH){
			this.stop().animate("attack_up", this.attackRate);
		} else if (this.walkingDirection == SOUTH){
			this.stop().animate("attack_down", this.attackRate);
		}
	},
	
	//-----------------------------------------------------------------------------
	//	Method - Die
	//-----------------------------------------------------------------------------
	
	die: function() {
		this.state = DYING;
		this.stop().animate("die", this.animationRate);
	}
});
