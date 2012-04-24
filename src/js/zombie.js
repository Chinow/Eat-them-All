//-----------------------------------------------------------------------------
//	Constants
//-----------------------------------------------------------------------------

// Zombie states
var SPAWNING = 10;
var MOVING_OUT_OF_SPAWN = 11;
var MOVING = 12;
var ATTACKING = 13;
var DYING = 14;
var DESTROYING = 15;

//-----------------------------------------------------------------------------
//	Zombie object
//-----------------------------------------------------------------------------

Crafty.c('Zombie', {
	
	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	currentCell: null,
	walkingDirection: NONE,
	state: SPAWNING,
	destroying: false,
	player: 0,
	size: 0,
	centerOffset: { x: 0, y: 0 },
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, zombi, Collision")
		
		if (this.size == 1) {
			this.collision(new Crafty.polygon([19, 22], [39, 22], [39, 42], [19, 42]));
		} else {
			this.collision(new Crafty.polygon([23, 43], [76, 43], [76, 74], [23, 74]));
		}
		
		this._globalZ = 7;
	},
	
	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	Zombie: function(player, size, playSpawnAnimation, direction) {
		this.player = player;
		this.size = size;
		this.walkingDirection = direction;
		
		if (size == 1) {
			this.centerOffset = { x: this.w / 2 - 5, y: this.h / 2 + 10 };
		} else {
			this.centerOffset = { x: this.w / 2, y: this.h / 2 };
		}
		
		// Setup animation
		this.animate("spawn", [[12,0],[13,0],[13,0],[14,0],[14,0]])
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
		.bind("EnterFrame", this.moveZombie);
		
		if (playSpawnAnimation) {
			this.animate("spawn", ETA.config.animation.zombie.spawn);
		} else if (direction) {
			this.changeDirection(direction);
		}
		
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Method - Move zombie
	//-----------------------------------------------------------------------------
	
	moveZombie: function() {
		if (this.state == DESTROYING) {
			return;
		}
		
		// Finish the spawn and start moving
		else if (this.state == SPAWNING && !this.isPlaying("spawn")) {
			this.state = MOVING_OUT_OF_SPAWN;
			this.changeDirection(this.walkingDirection);
		}
		
		// Finish the attack and die
		else if (this.state == ATTACKING
		&& !this.isPlaying("attack_right")
		&& !this.isPlaying("attack_left")
		&& !this.isPlaying("attack_up")
		&& !this.isPlaying("attack_down")) {
			this.die();
			return;
		}
		
		// Delete the sprite
		else if (this.state == DYING && !this.isPlaying("die")) {
			this.destroy();
			this.state = DESTROYING;
			return;
		}
		
		this.z = this.y;
		
		if (this.state == MOVING || this.state == MOVING_OUT_OF_SPAWN) {
			var beforeMiddle = false;
			var pastMiddle = false;
			
			var xoffset = 0;
			var yoffset = 0;
			
			if (this.size == 1) {
				switch (this.walkingDirection) {
					case WEST:	yoffset = -10;	break;
					case EAST:	yoffset = -10;	break;
				}
			} else {
				switch (this.walkingDirection) {
					case NORTH:	yoffset = -10;	break;
					case SOUTH:	yoffset =  10;	break;
					case WEST:	xoffset = -20;	break;
					case EAST:	xoffset =  20;	break;
				}
			}
			
			// Check whether the zombie is before the middle of the square
			if (this.currentCell) {
				var middleOffset = {
					x: this.x + this.centerOffset.x + xoffset - this.currentCell.center.x,
					y: this.y + this.centerOffset.y + yoffset - this.currentCell.center.y
				};
				
				beforeMiddle = (
					   this.walkingDirection == WEST  && middleOffset.x > 0
					|| this.walkingDirection == EAST  && middleOffset.x < 0
					|| this.walkingDirection == NORTH && middleOffset.y > 0
					|| this.walkingDirection == SOUTH && middleOffset.y < 0);
			}
			
			// Move the zombie
			this.move(this.walkingDirection, ETA.config.game.zombie.speed);
			
			// Check whether the zombie is after the middle of the square (after the movement)
			if (this.currentCell) {
				var middleOffset = {
					x: this.x + this.centerOffset.x + xoffset - this.currentCell.center.x,
					y: this.y + this.centerOffset.y + yoffset - this.currentCell.center.y
				};
				
				var afterMiddle = (
					   this.walkingDirection == WEST  && middleOffset.x <= 0
					|| this.walkingDirection == EAST  && middleOffset.x >= 0
					|| this.walkingDirection == NORTH && middleOffset.y <= 0
					|| this.walkingDirection == SOUTH && middleOffset.y >= 0);
				
				if (beforeMiddle && afterMiddle) {
					pastMiddle = true;
				}
			}
			
			pseudoCenter = {
				x: this.x + this.centerOffset.x + xoffset,
				y: this.y + this.centerOffset.y + yoffset
			};
			
			/*
			//DEBUG
			if (this.debug) {
				this.debug.destroy();
			}
			this.debug = Crafty.e("2D, DOM, Color")
			   .color("#FF0000")
			   .attr({
					x: this.x + 19,
					y: this.y + 22,
					z: this.y + 1,
					w: 20,
					h: 20
				});
			///DEBUG
			*/
			
			// Determine if the zombie changed cell
			var changedCell = false;
			var newCell = ETA.grid.getCell(pseudoCenter.x, pseudoCenter.y);
			
			if (newCell != this.currentCell) {
				if (this.state == MOVING_OUT_OF_SPAWN && this.currentCell) {
					this.state = MOVING;
				}
							
				this.currentCell = newCell;
				changedCell = true;
			}
			
			/*
			// Correct the zombie trajectory
			if (this.walkingDirection == WEST || this.walkingDirection == EAST) {
				var middleOffset = pseudoCenter.y - this.currentCell.center.y;
				
				if (middleOffset > 1) {
					this.move(NORTH, 1);
				} else if (middleOffset < -1) {
					this.move(SOUTH, 1);
				}
			} else if (this.walkingDirection == NORTH || this.walkingDirection == SOUTH) {
				var middleOffset = pseudoCenter.x - this.currentCell.center.x;
				
				if (middleOffset > 1) {
					this.move(WEST, 1);
				} else if (middleOffset < -1) {
					this.move(EAST, 1);
				}
			}*/
			
			// Check for signs
			if (pastMiddle) {
				var signDirection;
				
				if (this.currentCell.elem != null
				&& this.currentCell.elem.type == SIGN
				&& this.currentCell.elem.player.id == this.player.id) {
					var signDirection =  this.currentCell.elem.direction;
					
					// Sign and upper border
					if (this.currentCell.upperCell && signDirection == NORTH) {
						if (this.walkingDirection == NORTH) {
							this.changeDirection((Crafty.math.randomInt(1, 2) == 1) ? WEST : EAST);
						}
					}
					// Sign and lower border
					else if (this.currentCell.lowerCell && signDirection == SOUTH) {
						if (this.walkingDirection == SOUTH) {
							this.changeDirection((Crafty.math.randomInt(1, 2) == 1) ? WEST : EAST);
						}
					}
					// Sign
					else if (this.walkingDirection != signDirection) {
						this.changeDirection(signDirection);
					}
				} else {
					// Upper border
					if (this.currentCell.upperCell && this.walkingDirection == NORTH) {
						this.changeDirection((Crafty.math.randomInt(1, 2) == 1) ? WEST : EAST);
					}
					// Lower border
					else if (this.currentCell.lowerCell && this.walkingDirection == SOUTH) {
						this.changeDirection((Crafty.math.randomInt(1, 2) == 1) ? WEST : EAST);
					}
				}
			}
			
			// Cell has changed, check for new cell content
			if (this.state != MOVING_OUT_OF_SPAWN && changedCell) {
				if (this.currentCell.elem != null) {
					// Fortress
					if (this.currentCell.elem.type == FORTRESS || this.currentCell.elem.type == CEMETERY) {
						if (this.player.id == this.currentCell.elem.player.id) {
							this.changeDirection(this.player.defaultDirection);
						} else {
							this.currentCell.elem.loseHP(ETA.config.game.zombie.damage * this.size);
							this.attack(this.currentCell.elem.type);
							return;
						}
					}
					// City
					else if (this.currentCell.elem.type == CITY) {
						if (this.currentCell.elem.player == null || this.currentCell.elem.player.id != this.player.id) {
							// Attack city
							if (this.currentCell.elem.nbGuards - this.size >= 0) {
								this.currentCell.elem.loseGuards(this.size);
								this.attack(CITY);
								return;
							}
							// Invade city
							else {
								this.currentCell.elem.changePlayer(this.player);
								this.currentCell.elem.gainGuards(this.size);
								this.destroy();
								this.state = DESTROYING;
								return;
							}
						}
						// Enforce city
						else if (this.currentCell.elem.nbGuards < 99) {
							this.currentCell.elem.gainGuards(this.size);
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
			}
			
			// Check for collisions with other zombies
			var collisions = this.hit('zombi');
			if (collisions) {
				var nbCollisions = collisions.length;
				for (var i = 0; i < nbCollisions; i++) {
					if (collisions[i].type == "SAT") {
						var otherZombie = collisions[i].obj;
						
						if (otherZombie.player.id != this.player.id) {
							if (this.state == MOVING && otherZombie.state == MOVING) {
								if (this.size == otherZombie.size) {
									this.attack(ZOMBIE);
									otherZombie.attack(ZOMBIE);
								} else {
									this.setApart();
									otherZombie.setApart();
								}
								
								return;
							}
						}
					}
				}
			}
		}
	},
	
	//-----------------------------------------------------------------------------
	//	Method - Set apart
	//-----------------------------------------------------------------------------
	
	setApart: function() {
		if (this.size > 1) {
			var positions = [
				{ x: this.x -  0, y: this.y + 34, z: this.z },
				{ x: this.x + 32, y: this.y + 34, z: this.z },
				{ x: this.x + 14, y: this.y + 20, z: this.z },
				{ x: this.x + 44, y: this.y + 20, z: this.z },
				{ x: this.x + 33, y: this.y + 12, z: this.z },
			];
			
			var spriteName = (this.player.id == 1) ? "redZombie" : "blueZombie";
			
			for (var i in positions) {
				Crafty.e("Zombie, " + spriteName)
					.Zombie(this.player, 1, false, this.walkingDirection)
					.attr(positions[i]);
			}
			
			this.state = DESTROYING;
			this.destroy();
		}
	},
	
	//-----------------------------------------------------------------------------
	//	Method - Attack
	//-----------------------------------------------------------------------------
	
	attack: function(target) {
		this.state = ATTACKING;
		
		// Animate attack
		if (this.walkingDirection == WEST) {
			this.stop().animate("attack_left", ETA.config.animation.zombie.attack);
		} else if (this.walkingDirection == EAST) {
			this.stop().animate("attack_right", ETA.config.animation.zombie.attack);
		} else if (this.walkingDirection == NORTH) {
			this.stop().animate("attack_up", ETA.config.animation.zombie.attack);
		} else if (this.walkingDirection == SOUTH) {
			this.stop().animate("attack_down", ETA.config.animation.zombie.attack);
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
	//	Method - Change direction
	//-----------------------------------------------------------------------------
	
	changeDirection: function(newDirection) {
		this.walkingDirection = newDirection;
		
		if (this.walkingDirection == WEST && !this.isPlaying("walk_left")) {
			this.stop().animate("walk_left", ETA.config.animation.zombie.walk, -1);
		} else if (this.walkingDirection == EAST && !this.isPlaying("walk_right")) {
			this.stop().animate("walk_right", ETA.config.animation.zombie.walk, -1);
		} else if (this.walkingDirection == NORTH && !this.isPlaying("walk_up")) {
			this.stop().animate("walk_up", ETA.config.animation.zombie.walk, -1);
		} else if (this.walkingDirection == SOUTH && !this.isPlaying("walk_down")) {
			this.stop().animate("walk_down", ETA.config.animation.zombie.walk, -1);
		}
	},
	
	//-----------------------------------------------------------------------------
	//	Method - Die
	//-----------------------------------------------------------------------------
	
	die: function() {
		this.state = DYING;
		this.stop().animate("die", ETA.config.animation.zombie.die);
	}
});
