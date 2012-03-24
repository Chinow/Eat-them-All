Crafty.c('BGGrid', {
	width:0,
	height:0,
	cells: [],
	background : {},
	init : function(){
		cells = [];
		cells[0] = [];
		background = Crafty.e("2D, DOM, bg")
			.attr({ x:0 , y:0, z:1 });
		return this;
	},
	grid: function(w, h){
		
		this.width = w;
		this.height = h;
		for (var i = 0; i < w; i++) {
			this.cells[i] = [];
			for (var j = 0; j < h; j++) {
				this.cells[i][j] = Crafty.e("Cell")
				.attr({x:i*ETA.config.tile.tileWidth, y:j*ETA.config.tile.tileHeight+30, w:ETA.config.tile.tileWidth ,h:ETA.config.tile.tileHeight})
				.cell();
				if (j == 0 || j == h-1)
				{
					this.cells[i][j].borderCell = true;
				}
			}
		}
		
		Crafty.e("Line, 2D, DOM, gridBounds, Color, Collision")
			.color('rgb(30,150,30)')
			.attr({ x:0, y:30 , w:2, h:ETA.config.stageHeight })
			.collision();
		Crafty.e("Line, 2D, DOM, gridBounds, Color, Collision")
			.color('rgb(30,150,30)')
			.attr({ x:ETA.config.stageWidth-2, y:30 , w:2, h:ETA.config.stageHeight })
			.collision();
		/*Crafty.e("Line, 2D, DOM, gridBounds, Color, Collision")
			.color('rgb(30,150,30)')
			.attr({ x:0, y:29 , w:ETA.config.stageWidth, h:2 })
			.collision();*/
		/*Crafty.e("Line, 2D, DOM, gridBounds, Color, Collision")
			.color('rgb(30,150,30)')
			.attr({ x:0, y:ETA.config.stageHeight-2 , w:ETA.config.stageWidth , h:2 })
			.collision();*/
			
		return this;
	},
	
	getCell: function(x, y) {
		var vX = x / ETA.config.tile.tileWidth ;
		var vY = (y-30) / ETA.config.tile.tileHeight  ;
		if (vX < 0)
			vX = 0;
		if (vY < 0)
			vY = 0;
		return this.cells[parseInt(vX)][parseInt(vY)];
	}
	
});
