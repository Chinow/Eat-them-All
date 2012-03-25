Crafty.c('Fortress', {
	hitPoints: ETA.config.game.hitPointsFortress,
	player:null,
	init: function() {
		this.requires("2D, DOM, fortress, Collision");
		this.collision();
		return this;
	},
	Fortress : function(cellX, cellY, player) {
		this.cell = ETA.grid.cells[cellX][cellY];
		this.z = this.y;
		this.player = player;
		
		this.cell.elem = this;
		this.cell.elemType = "fortress";
		if (player.id == "1")
		{
			this.attr({ x: this.cell.x-18, y: this.cell.y-25, z: 1100 });
		}
		else if (player.id == "2")
		{
			this.attr({ x: this.cell.x, y: this.cell.y-25, z: 1100 });
		}
		return this;
	},
	loseHP : function (value){
		this.player.HPLeft = this.player.HPLeft - value;
		if (this.player.HPLeft <= 0)
		{
			this.player.youLose();
		}
	}	
});
