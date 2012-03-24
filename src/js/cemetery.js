Crafty.c('Cemetery', {
	frequencySpawn: 1000 * ETA.config.game.timeSpawnFortress,
	spawnRun: true,
	gridX: 0,
	gridY: 0,
	cell: null,
	spawnDirection:"e",

	init: function() {
		this.requires("2D, DOM");
		return this;
	},

	Cemetery: function(cellX, cellY) {
		this.cell = ETA.grid.cells[cellX][cellY];
		this.attr({ x: this.cell.x, y: this.cell.y, z: 500 });
		this.spawn();
		return this;
	},
	spawn: function() {
		if(this.spawnRun && ETA.debug.play) {
			Crafty.e("Zombie, zombieSprite")
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
