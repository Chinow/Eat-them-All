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
		this.player.master = this;
		this.animate("steady", [[0,0],[1,0]])
			.animate("summon", [[3,0],[4,0],[3,0]])
			.animate("steady", rate, -1)
			.bind("EnterFrame", this.setSteady);
		
		if (player.id == 1) {
			this.attr({ x: this.cell.x , y: this.cell.y - 110 , z:this.cell.y});
		} else {
			this.attr({ x: this.cell.x-10, y: this.cell.y - 110, z:this.cell.y });
		}
		
		return this;
	},
	summon :function(){
			this.stop().animate("summon", 5, 0);
	},
	setSteady :function(){
		if (!this.isPlaying("summon"))
		{
			var rate = ETA.config.frameRate / ETA.config.cemeteryAnimationRate;
			this.animate("steady", rate, -1)
		}
	}
});

