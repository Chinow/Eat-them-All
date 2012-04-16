Crafty.c('VoodooMaster', {

	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	player: null,
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init: function() {
		this.requires("2D, DOM, SpriteAnimation");
		this._globalZ = 9;
		return this;
	},

	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	VoodooMaster: function(player, cellX, cellY) {
		this.player = player;
		this.cell = ETA.grid.cells[cellX][cellY];
		this.cell.elemType = "master";
		this.cell.elem = this;
		this.player.master = this;
		this.animate("steady", [[0,0],[1,0]])
			.animate("summon", [[3,0],[4,0],[4,0],[3,0]])
			.bind("EnterFrame", this.setSteady);
		
		if (player.id == 1) {
			this.attr({ x: this.cell.x, y: this.cell.y - 110 , z:this.cell.y });
		} else {
			this.attr({ x: this.cell.x - 10, y: this.cell.y - 110, z:this.cell.y });
		}
		
		this.setSteady();
		
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Methods
	//-----------------------------------------------------------------------------
	
	summon :function(){
		this.stop().animate("summon", ETA.config.animation.sorcerer.summon);
	},
	
	setSteady :function(){
		if (!this.isPlaying("summon")) {
			this.animate("steady", ETA.config.animation.sorcerer.stand, -1);
		}
	}
});

