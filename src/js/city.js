Crafty.c('City', {
	
	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	type: CITY,
	frames: 0,
	outFrames: 0,
	config: undefined,
	nbGuards: 0,
	nbHumans: 0,
	player: null,
	life: null,
	text: null,
	hudHeight: 0,
	hudXOffset: 0,
	hudYOffset: 0,
	textOffsetX: null,
	doorsOpen: false,
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init: function() {
		this.requires("2D, DOM, City, SpriteAnimation");
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	City: function(cellX, cellY, size) {
		this.cell = ETA.grid.cells[cellX][cellY];
		this.z = this.y;
		
		this.animate("neutral", [[0,0],[0,0]]);
		this.animate("blue", [[1,0],[1,0]]);
		this.animate("red", [[2,0],[2,0]]);
		this.animate("neutralDead", [[3,0],[3,0]]);
		this.animate("blueDead", [[4,0],[4,0]]);
		this.animate("redDead", [[5,0],[5,0]]);

		if (size == 1) {
			this.hudHeight = 14;
			this.hudXOffset = 39;
			this.hudYOffset = 27;
			this.textOffsetX = -11;
			this.config = ETA.config.game.village;
		} else if (size == 2) {
			this.hudHeight = 24;
			this.hudXOffset = 32
			this.hudYOffset = 17;
			this.textOffsetX = -17;
			this.config = ETA.config.game.town;
		} else if (size == 3) {
			this.hudHeight = 37;
			this.hudXOffset = 32;
			this.hudYOffset = 4;
			this.textOffsetX = -17;
			this.config = ETA.config.game.city;
		}
		
		this.nbGuards = this.config.maxGuards;
		this.nbHumans = this.config.maxHumans;
		this.cell.elem = this;
		this.animate("neutral", 10, 1);
		this.attr({ x: this.cell.x, y: this.cell.y - 25, z: this.cell.y - 25 });
		this.drawLife();
		this.drawText();
		this.bind("EnterFrame", this.procreate);
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Methods
	//-----------------------------------------------------------------------------
	
	loseGuards : function (value){
		this.nbGuards = this.nbGuards - value;
		this.drawText();
	},
	gainGuards: function (value){
		this.nbGuards = Math.min(this.nbGuards + value, 99);
		this.drawText();
	},
	changePlayer: function(player){
		this.doorsOpen = false;
		this.player = player;
		this.updateSprite();
	},
	updateSprite: function() {
		var spriteAnimation;
		
		if (this.player == null) {
			spriteAnimation = "neutral";
		} else if (this.player.id == 1) {
			spriteAnimation = "red";
		} else if (this.player.id == 2) {
			spriteAnimation = "blue";
		}
		
		if (this.nbHumans == 0) {
			spriteAnimation += "Dead";
		}
		
		this.stop().animate(spriteAnimation, 10, 1);
	},
	drawLife: function() {
		var ratio = this.nbHumans / this.config.maxHumans;
		var color = (ratio > 0.66) ? 'rgb( 20, 200,  20)':
					(ratio < 0.33) ? 'rgb(255,   0,   0)':
									 'rgb(240, 195,   0)';
		
		if (this.life) {
			this.life.destroy();
		}
		
		this.life = Crafty.e("2D, DOM, Color")
			.color(color)
			.attr({
				x: this.cell.x + this.hudXOffset,
				y: this.cell.y + this.hudYOffset + (this.hudHeight - this.hudHeight * ratio + 1),
				z: this.cell.y - 25,
				w: 3,
				h: this.hudHeight * ratio
			});
	},
	drawText: function() {
		if (this.text) {
			this.text.destroy();
		}
		
		this.text = Crafty.e("2D, DOM, Text")
			.attr({
				w: 15,
				h: 20,
				x: this.cell.center.x + this.textOffsetX,
				y: this.cell.center.y - 29,
				z: this.cell.y - 25
			})
			.text(this.nbGuards + "")
			.css({
				"text-align": "center",
				"color" : "#FFFFFF",
				"font-family":"arial",
				"font-weight":"bold",
				"font-size":"12px"
			});
	},
	switchDoorState: function() {
		this.doorsOpen = !this.doorsOpen;
		
		if (this.doorsOpen) {
			Crafty.audio.play("doorOpen");
		} else {
			Crafty.audio.play("doorClose");
		}
	},
	procreate: function() {
		if (this.nbHumans > 0) {
			if (this.player == null && this.nbHumans < this.config.maxHumans) {
				var proclimit = this.config.procreationSpeed * this.nbHumans / ETA.config.frameRate;
				
				if (Crafty.math.randomNumber(0, 1) < proclimit) {
					this.nbHumans++;
					this.drawLife();
				}
			}
			
			if (this.player != null && this.nbGuards > 0) {
				this.frames++;
				
				if (this.frames >= ETA.config.frameRate / this.config.eatSpeed) {
					this.nbHumans --;
					this.gainGuards(1);
					this.drawLife();
					this.frames = 0;
				
					if (this.nbHumans == 0) {
						this.updateSprite();
						Crafty.audio.play("cityDie");
					}
				}
			}
		}
		
		++this.outFrames;
		
		if (this.doorsOpen && this.nbGuards > 0) {
			var exitThreshold;
			var nbZombies;
			
			if (this.nbGuards >= ETA.config.game.zombie.minToPack) {
				nbZombies = ETA.config.game.zombie.packSize;
				exitThreshold = this.config.packExitSpeed;
			} else {
				nbZombies = 1;
				exitThreshold = this.config.exitSpeed;
			}
			
			if (this.outFrames >= exitThreshold * ETA.config.frameRate) {
				this.loseGuards(nbZombies);
				this.outFrames = 0;
				
				var spriteName;
				var xoffset;
				var yoffset;

				if (nbZombies == 1) {
					if (this.player.id == 1) {
						spriteName = "redZombie";
						xoffset = 25;
						yoffset = 10;
					} else {
						spriteName = "blueZombie";
						xoffset = -25;
						yoffset = 10;
					}
					
					yoffset += Crafty.math.randomNumber(-10, 10);
				} else {
					if (this.player.id == 1) {
						spriteName = "redZombiePack";
						xoffset = 25;
						yoffset = -10;
					} else {
						spriteName = "blueZombiePack";
						xoffset = -49;
						yoffset = -10;
					}
				}
				
				Crafty.e("Zombie, " + spriteName)
					.Zombie(this.player, nbZombies, false, this.player.defaultDirection)
					.attr({
						x: this.x + xoffset,
						y: this.y + yoffset,
						z: 900
					});
			}
		}
	}
});

