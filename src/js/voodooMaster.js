Crafty.c('VoodooMaster', {
	player: null,
	init: function() {
		this.requires("2D, DOM, SpriteAnimation");
        this._globalZ=9;
		return this;
	},

	VoodooMaster: function(player, cellX, cellY) {
		this.player = player;
		var rate = ETA.config.frameRate / ETA.config.cemeteryAnimationRate;
		this.cell = ETA.grid.cells[cellX][cellY];
		this.cell.elemType = "master";
		this.cell.elem = this;
		this.animate("torch_burn", [[0,0],[1,0]])
			.animate("torch_burn", rate, -1);
		
		if (playerId == 1) {
			//this.attr({ x: this.cell.x - 60, y: this.cell.y - 50, z: 0 });
		} else {
			//this.attr({ x: this.cell.x, y: this.cell.y - 50, z: 0 });
		}
		
		return this;
	}
});

