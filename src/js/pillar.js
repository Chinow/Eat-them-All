Crafty.c('Pillar', {

	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	player: null,
	life: null,
	cell: null,
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init: function() {
		this.requires("2D, DOM");
		this._globalZ = 9;
		return this;
	},

	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	Pillar: function(player, cellX, cellY) {
		this.player = player;
		this.cell = ETA.grid.cells[cellX][cellY];
		this.player.pillar = this;
		
		if (player.id == 1) {
			this.attr({ x: this.cell.x - 15, y: this.cell.y - 55, z: this.cell.y });
		} else {
			this.attr({ x: this.cell.x + 35, y: this.cell.y - 55, z: this.cell.y });
		}
		
		this.drawLife();
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Methods - Draw life
	//-----------------------------------------------------------------------------
	
	drawLife: function() {
		var ratio = this.player.HPLeft / ETA.config.game.fortress.hitPoints;
		
		var color = (ratio > 0.66) ? 'rgb( 20, 200,  20)':
					(ratio < 0.33) ? 'rgb(255,   0,   0)':
									 'rgb(240, 195,   0)';
		
		if (this.life) {
			this.life.destroy();
		}
		
		if (this.player.id == 1) {
			this.life = Crafty.e("2D, DOM, Color")
				.color(color)
				.attr({
					x: this.cell.x + 19,
					y: this.cell.y - 46 + (51 - 51 * ratio + 1),
					z: this.cell.y + 1,
					w: 12,
					h:51 * ratio
				});			
		} else {
			this.life = Crafty.e("2D, DOM, Color")
				.color(color)
				.attr({
					x: this.cell.x + 69,
					y: this.cell.y - 46 + (51 - 51 * ratio + 1),
					z: this.cell.y + 1,
					w: 12,
					h: 51 * ratio
				});
		}
	}
});

