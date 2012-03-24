Crafty.c('Cemetery', {
	frequencySpawn: 1000 * ETA.config.game.timeSpawnFortress,
	spawnRun: true,
	gridX: 0,
	gridY: 0,
	cell: null,
	spawnDirection:"e",
	playerId: 0,
	init: function() {
		this.requires("2D, DOM, SpriteAnimation");
		return this;
	},

	Cemetery: function(playerId, cellX, cellY) {
		this.playerId = playerId;
		
		var rateBegin = ETA.config.frameRate/ETA.config.signBeginAnimationRate;
		var rate = ETA.config.frameRate / ETA.config.signAnimationRate;
		this.cell = ETA.grid.cells[cellX][cellY];
		this.attr({ x: this.cell.x - 50, y: this.cell.y - 50, z: 1100 });
		this.animate("torch_burn", [[0,0],[1,0]])
			.animate("torch_burn", rate / 2, -1);
		this.spawn();
		return this;
	},
	spawn: function() {
		if(this.spawnRun && ETA.debug.play) {
			Crafty.e("Zombie, zombieRougeSprite")
				.Zombie()
				.attr({ x: this.cell.center.x, y: this.cell.center.y, z: 900 });
		}
		this.timeout(this.spawn, this.frequencySpawn);
	},
	startSpawn: function() {
		this.spawnRun = true;
	},
	stopSpawn: function() {
		this.spawnRun = false;
	},
});
