//-----------------------------------------------------------------------------
//	Constants
//-----------------------------------------------------------------------------

// Zombie states
var SPAWNING = 0;
var MOVING_OUT_OF_SPAWN = 1;
var MOVING = 2;
var ATTACKING = 3;
var DYING = 4;
var DESTROYING = 5;

//-----------------------------------------------------------------------------
//	Zombie object
//-----------------------------------------------------------------------------

Crafty.c('Zombie', {
	
	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	targetPixel: { x: 500, y: 250 },
	currentCell: null,
	walkingDirection: NONE,
	state: SPAWNING,
	destroying: false,
	player: 0,
	animationRate: ETA.config.frameRate / ETA.config.zombiAnimationRate,
	attackRate: ETA.config.frameRate / ETA.config.zombiAttackAnimationRate,
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, zombi, Collision")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
		this._globalZ = 7;
	},
	
	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	Zombie: function(player, playSpawnAnimation) {
		this.player = player;
		this.walkingDirection = (player.id == 1) ? EAST : WEST;
		
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
		
		if (playSpawnAnimation) {
			this.animate("spawn", this.animationRate);
		} else {
			this.state = MOVING_OUT_OF_SPAWN;
			
			if (this.walkingDirection == EAST) {
				this.animate("walk_right", this.animationRate, -1);
			} else {
				this.animate("walk_left", this.animationRate, -1);
			}
		}
		
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Method - Move zombie
	//-----------------------------------------------------------------------------
	
	moveZombi: function() {
		if (this.state == DESTROYING) {
			return;
		}
		
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
			this.state = DESTROYING;
			return;
		}
		
		this.z = this.y;
		
		if (this.state == MOVING || this.state == MOVING_OUT_OF_SPAWN) {
			if (!this.currentCell) {
				this.currentCell = ETA.grid.getCell(this.x + this.w / 2 - 5, this.y + this.h / 2 + 10);
			}
			
			var direction = {
				x: this.x + this.w / 2 - 5  - this.currentCell.center.x,
				y: this.y + this.h / 2 + 10 - this.currentCell.center.y
			};
			
			var middleDelta;
			
			if (this.walkingDirection == WEST || this.walkingDirection == EAST) {
				if (direction.y > 1) {
					this.move(NORTH, 1);
				} else if (direction.y < -1) {
					this.move(SOUTH, 1);
				}
				
				middleDelta = Math.abs(this.x + this.w / 2 -5 - this.currentCell.center.x);
			} else {
				if (direction.x > 1) {
					this.move(WEST,1);
				} else if (direction.x < -1) {
					this.move(EAST,1);
				}
					
				middleDelta = Math.abs(this.y + this.h / 2 + 10 - this.currentCell.center.y);
			}
			
			if (middleDelta < 10) {
				var signDirection;
				
				if (this.currentCell.elem != null
				&& this.currentCell.elem.type == SIGN
				&& this.currentCell.elem.player.id == this.player.id) {
					var signDirection =  this.currentCell.elem.direction;
					
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
				} else {
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
		
			// Attack fortress
			if (this.state == MOVING && this.currentCell.elem != null) {
				if (this.currentCell.elem.type == FORTRESS || this.currentCell.elem.type == CEMETERY) {
					if (this.player.id == this.currentCell.elem.player.id) {
						this.walkingDirection = (this.walkingDirection == EAST) ? WEST : EAST;
					} else {
						this.currentCell.elem.loseHP(ETA.config.game.zombiDamage);
						this.attack(this.currentCell.elem.type);
						return;
					}
				} else if (this.currentCell.elem.type == CITY) {
					if (this.currentCell.elem.player == null || this.currentCell.elem.player.id != this.player.id) {
						// Attack city
						if (this.currentCell.elem.nbGuards > 0) {
							this.currentCell.elem.loseGuards(1);
							this.attack(CITY);
							return;
						}
						// Invade city
						else {
							this.currentCell.elem.changePlayer(this.player);
							this.currentCell.elem.gainGuards(1);
							this.destroy();
							this.state = DESTROYING;
							return;
						}
					}
					// Enforce city
					else if (this.currentCell.elem.nbGuards < 99) {
						this.currentCell.elem.gainGuards(1);
						this.destroy();
						this.state = DESTROYING;
						return;
					}
					// Return to the earth
					else {
						this.die();
						return;
					}
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
						if (collide2[i].obj.player.id != this.player.id) {
							if (this.state == MOVING && collide2[i].obj.state == MOVING) {
								collide2[i].obj.attack(ZOMBIE);
								this.attack(ZOMBIE);
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
			
			var newCell = ETA.grid.getCell(this.x + this.w / 2 - 5, this.y + this.h / 2 + 10);
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
	
	attack: function(target) {
		this.state = ATTACKING;
		
		// Animate attack
		if (this.walkingDirection == WEST) {
			this.stop().animate("attack_left", this.attackRate);
		} else if (this.walkingDirection == EAST) {
			this.stop().animate("attack_right", this.attackRate);
		} else if (this.walkingDirection == NORTH) {
			this.stop().animate("attack_up", this.attackRate);
		} else if (this.walkingDirection == SOUTH) {
			this.stop().animate("attack_down", this.attackRate);
		}
		
		// Create chunks		
		if (target == CITY || target == FORTRESS) {
			var chunkPosition = { x: this.x, y: this.y, z: this.z };
			
			if (this.walkingDirection == WEST) {
				chunkPosition.x -= 15;
				chunkPosition.y -= 15;
			} else if (this.walkingDirection == EAST) {
				chunkPosition.x += 15;
				chunkPosition.y -= 15;
			} else if (this.walkingDirection == NORTH) {
				chunkPosition.y -= 15;
			} else if (this.walkingDirection == SOUTH) {
				chunkPosition.y += 10;
			}
			
			Crafty.e("Chunks, chunks")
				.Chunks()
				.attr(chunkPosition);
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
