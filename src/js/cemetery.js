Crafty.c('Cemetery', {
	spawnCounter: 0,
	spawnRun: true,
	gridX: 0,
	gridY: 0,
	cell: null,
	player: null,
	spawnPoint: {},
	init: function() {
		this.requires("2D, DOM, SpriteAnimation");
        this._globalZ=4;
		return this;
	},

	Cemetery: function(player, cellX, cellY) {
		this.player = player;
		var rate = ETA.config.frameRate / ETA.config.cemeteryAnimationRate;
		this.cell = ETA.grid.cells[cellX][cellY];
		this.cell.elemType = "cemetery";
		this.cell.elem = this;
		
		this.spawnPoint = { x: this.cell.x, y: this.cell.y - 15 };
		this.animate("torch_burn", [[0,0],[1,0]])
			.animate("torch_burn", rate, -1);
		
		if (player.id == 1) {
			this.attr({ x: this.cell.x - 60, y: this.cell.y - 50, z: 0 });
		} else {
			this.attr({ x: this.cell.x, y: this.cell.y - 50, z: 0 });
		}
		
		this.bind("EnterFrame", this.spawn);
		
		return this;
	},
	spawn: function() {
		if (this.spawnRun) {
			if (++this.spawnCounter == ETA.config.game.timeSpawnFortress * ETA.config.frameRate) {
				this.spawnCounter = 0;
				var spriteName = (this.player.id == 1) ? "zombieRougeSprite" : "zombieBleuSprite";
				
				Crafty.e("Zombie, " + spriteName)
					.Zombie(this.player.id, true)
					.attr({ x: this.spawnPoint.x, y: this.spawnPoint.y, z:900 });
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
