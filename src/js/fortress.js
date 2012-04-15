Crafty.c('Fortress', {

	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	type: FORTRESS,
	hitPoints: ETA.config.game.fortress.hitPoints,
	player: null,
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init: function() {
		this.requires("2D, DOM, fortress, Collision");
		this.collision();
		this._globalZ = 3;
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	Fortress : function(cellX, cellY, player) {
		this.cell = ETA.grid.cells[cellX][cellY];
		this.z = this.y;
		this.player = player;
		this.cell.elem = this;
		
		if (player.id == 1) {
			this.attr({ x: this.cell.x-18, y: this.cell.y-25, z: this.cell.y-25 });
		} else {
			this.attr({ x: this.cell.x, y: this.cell.y-25, z:this.cell.y-25 });
		}
		
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Method - lose HP
	//-----------------------------------------------------------------------------
	
	loseHP : function (value){
		this.player.HPLeft = this.player.HPLeft - value;
		this.player.pillar.drawLife();
		
		if (this.player.HPLeft <= 0) {
			this.player.youLose();
		}
	}
});
