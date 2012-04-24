Crafty.c('Cemetery', {
	
	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	type: CEMETERY,
	spawnCounter: 0,
	spawnRun: true,
	gridX: 0,
	gridY: 0,
	cell: null,
	player: null,
	spawnPoint: {},
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init: function() {
		this.requires("2D, DOM, SpriteAnimation");
		this._globalZ = 4;
		return this;
	},

	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	Cemetery: function(player, cellX, cellY) {
		this.player = player;
		this.cell = ETA.grid.cells[cellX][cellY];
		this.cell.elem = this;
		
		this.spawnPoint = { x: this.cell.x, y: this.cell.y - 15 };
		this.animate("torch_burn", [[0,0],[1,0]])
			.animate("torch_burn", ETA.config.animation.cemetery.flame, -1);
		
		if (player.id == 1) {
			this.attr({ x: this.cell.x - 60, y: this.cell.y - 50, z: 0 });
		} else {
			this.attr({ x: this.cell.x, y: this.cell.y - 50, z: 0 });
		}
		
		this.bind("EnterFrame", this.spawn);
		
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Methods
	//-----------------------------------------------------------------------------
	
	spawn: function() {
		if (this.spawnRun) {
			if (++this.spawnCounter == ETA.config.game.cemetery.spawnPeriod * ETA.config.frameRate) {
				this.spawnCounter = 0;
				var spriteName = (this.player.id == 1) ? "redZombie" : "blueZombie";
				
				Crafty.e("Zombie, " + spriteName)
					.Zombie(this.player, 1, true, this.player.defaultDirection)
					.attr({
						x: this.spawnPoint.x,
						y: this.spawnPoint.y + Crafty.math.randomNumber(-10, 10),
						z: 900
					});
			}
		}
	},
	startSpawn: function() {
		this.spawnRun = true;
	},
	stopSpawn: function() {
		this.spawnRun = false;
	},
	loseHP : function (value){
		this.player.HPLeft = this.player.HPLeft - value;
		this.player.pillar.drawLife();
		
		if (this.player.HPLeft <= 0) {
			this.player.youLose();
		}
	}
});
