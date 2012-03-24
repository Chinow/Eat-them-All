Crafty.c('Cemetery', {
	frequencySpawn: 1000 * ETA.config.game.timeSpawnFortress,
	spawnRun: false,
	grydX: 0,
	grydY: 0,
	cell: null,
	init: function() {
		this.requires("2D, DOM");
		return this;
	},
	Cemetery: function(GridX, GridY) {
		this.timeout(this.spawn, this.frequencySpawn);
		return this;
	},
	spawn: function() {
		if(this.spawnRun) {
			Crafty.e("Zombie, zombieSprite")
				.Zombie()
				.attr({ x: 200, y: 200, z: 1 });
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
