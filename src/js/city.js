Crafty.c('City', {
	nbGards: ETA.config.game.nbGuardsHameau,
	playerId:0,
	text:null,
	init: function() {
		this.requires("2D, DOM, city, SpriteAnimation");
		return this;
	},
	City : function(cellX, cellY, size) {
		this.cell = ETA.grid.cells[cellX][cellY];
		this.z = this.y;
		this.animate("neutral", [[0,0],[0,0]]);
		this.animate("blue", [[1,0],[1,0]]);
		this.animate("red", [[2,0],[2,0]]);
		this.animate("neutral_dead", [[3,0],[3,0]]);
		this.animate("blue_dead", [[4,0],[4,0]]);
		this.animate("red_dead", [[5,0],[5,0]]);

		if (size == "hameau")
			nbGards = ETA.config.game.nbGuardsHameau;
		else if (size == "village")
			nbGards = ETA.config.game.nbGuardsVillage;
		else if (size == "ville")
			nbGards = ETA.config.game.nbGuardsVille;

		this.cell.elem = this;
		this.cell.elemType = "city";
		this.animate("neutral",10, 1);
		this.attr({ x: this.cell.x, y: this.cell.y-25, z: this.cell.y-25 });
		this.text =Crafty.e("2D, DOM, Text").attr({ w: 15, h: 20, x: this.cell.center.x-11, y: this.cell.center.y-29, z:this.cell.center.y+1 })
				.text(this.nbGards+"")
				.css({ "text-align": "center", "color" : "#fff", "font-family":"arial" , "font-weight":"bold", "font-size":"12px"});

		return this;
	},
	loseGuard : function (value){
		this.nbGards = this.nbGards - value;
		this.text.destroy();
		this.text =Crafty.e("2D, DOM, Text").attr({ w: 15, h: 20, x: this.cell.center.x-11, y: this.cell.center.y-29, z:this.cell.center.y+1 })
				.text(this.nbGards+"")
				.css({ "text-align": "center", "color" : "#fff", "font-family":"arial" , "font-weight":"bold", "font-size":"12px"});
	},
	gainGuards : function (value){
		this.nbGards = this.nbGards + value;
		this.text.destroy();
		this.text =Crafty.e("2D, DOM, Text").attr({ w: 15, h: 20, x: this.cell.center.x-11, y: this.cell.center.y-29, z:this.cell.center.y+1 })
				.text(this.nbGards+"")
				.css({ "text-align": "center", "color" : "#fff", "font-family":"arial" , "font-weight":"bold", "font-size":"12px"});
	},
	changePlayed : function(playerId){
		if (playerId == 0)
		{
			this.playerId = 0;
			this.gainGuards(1);
			if (!this.isPlaying("neutral"))
				this.stop().animate("neutral", 10, 1);
		}
		else if (playerId == 2)
		{
			this.playerId = 2;
			this.gainGuards(1);
			if (!this.isPlaying("blue"))
				this.stop().animate("blue", 10, 1);
		}
		else
		{
			this.playerId = 1;
			this.gainGuards(1);
			if (!this.isPlaying("red"))
				this.stop().animate("red", 10, 1);
		}
	}
});

