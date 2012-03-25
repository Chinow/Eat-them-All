Crafty.c('Pillar', {
	player: null,
	life : null,
	init: function() {
		this.requires("2D, DOM");
        this._globalZ=9;
		return this;
	},

	Pillar: function(player, cellX, cellY) {
		this.player = player;
		var rate = ETA.config.frameRate / ETA.config.cemeteryAnimationRate;
		this.cell = ETA.grid.cells[cellX][cellY];
		this.cell.elemType = "pillar";
		this.cell.elem = this;
		this.player.pillar = this;
		
		if (player.id == 1) {
			this.attr({ x: this.cell.x-15 , y: this.cell.y-55  , z:this.cell.y});
		} else {
			this.attr({ x: this.cell.x+35, y: this.cell.y-55 , z:this.cell.y });
		}
		this.drawLife();
		return this;
	},
	drawLife: function()
	{
		var ratio = this.player.HPLeft/ETA.config.game.hitPointsFortress;
		var color;
		if (ratio > 0.66)
			color = 'rgb(20,200,20)';
		else if (ratio < 0.33)
			color = 'rgb(255,0,0)';
		else
			color = 'rgb(240,195,0)';
		if (this.life)
			this.life.destroy();

		if (this.player.id == 1) {
			this.life = Crafty.e("2D, DOM, Color")
					.color(color)
					
					.attr({ x: this.cell.x + 19 , y: this.cell.y-46 + (51 - 51*ratio+1), z: this.cell.y+1, w: 12, h:51*ratio});
					
		} else {
			this.life = Crafty.e("2D, DOM, Color")
					.color(color)
					.attr({ x: this.cell.x + 69, y: this.cell.y-46 + (51 - 51*ratio+1), z:this.cell.y+1, w: 12, h:51*ratio});
		}
		
	}
});

