Crafty.c('Fortress', {
	hitPoints: ETA.config.game.hitPointsFortress,
	init: function() {
		this.requires("2D, DOM, fortress, Collision");
		this.collision();
		return this;
	},
	Fortress : function(cellX, cellY, size) {
		this.cell = ETA.grid.cells[cellX][cellY];
		if (size == "left")
			this.attr({ x: this.cell.x-18, y: this.cell.y-25, z: 1100 });
		else if (size == "right")
			this.attr({ x: this.cell.x, y: this.cell.y-25, z: 1100 });
		return this;
	},	
});
