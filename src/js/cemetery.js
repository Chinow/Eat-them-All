Crafty.c('Cemetery', {
	spawnCounter: 0,
	spawnRun: true,
	gridX: 0,
	gridY: 0,
	cell: null,
	playerId: 0,
	spawnPoint: {},
	init: function() {
		this.requires("2D, DOM, SpriteAnimation");
		return this;
	},

	Cemetery: function(playerId, cellX, cellY) {
		this.playerId = playerId;
		var rate = ETA.config.frameRate / ETA.config.cemeteryAnimationRate;
		this.cell = ETA.grid.cells[cellX][cellY];
		this.cell.elemType = "cemetry";
		this.cell.elem = this;
		
		this.spawnPoint = { x: this.cell.x, y: this.cell.y - 15 };
		this.animate("torch_burn", [[0,0],[1,0]])
			.animate("torch_burn", rate, -1);
		
		if (playerId == 1) {
			this.attr({ x: this.cell.x - 60, y: this.cell.y - 50, z: 1100 });
		} else {
			this.attr({ x: this.cell.x, y: this.cell.y - 50, z: 1100 });
		}
		
		this.bind("EnterFrame", this.spawn);
		
		return this;
	},
	spawn: function() {
		if (this.spawnRun) {
			if (++this.spawnCounter == ETA.config.game.timeSpawnFortress * ETA.config.frameRate) {
				this.spawnCounter = 0;
				var spriteName = (this.playerId == 1) ? "zombieRougeSprite" : "zombieBleuSprite";
				
				Crafty.e("Zombie, " + spriteName)
					.Zombie(this.playerId)
					.attr({ x: this.spawnPoint.x, y: this.spawnPoint.y, z: 900 });
			}
		}
	},
	startSpawn: function() {
		this.spawnRun = true;
	},
	stopSpawn: function() {
		this.spawnRun = false;
	},
});
