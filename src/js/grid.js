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
		/*for (var i = 0; i < w; i++) {
			Crafty.e("Line, 2D, DOM, Color")
			.color('rgb(255,255,255)')
			.attr({ x: i*ETA.config.tile.tileWidth-1, y:30, w: 2, h: ETA.config.stageHeight });
		}
		for (var j = 0; j < h; j++) {
				Crafty.e("Line, 2D, DOM, Color")
			.color('rgb(255,255,255)')
			.attr({ x:0 , y:j*ETA.config.tile.tileHeight+29, w: ETA.config.stageWidth, h:2 });
		}*/
		Crafty.e("Line, 2D, DOM, gridBounds, Color, Collision")
			.color('rgb(30,150,30)')
			.attr({ x:0, y:30 , w:2, h:ETA.config.stageHeight })
			.collision();
		Crafty.e("Line, 2D, DOM, gridBounds, Color, Collision")
			.color('rgb(30,150,30)')
			.attr({ x:ETA.config.stageWidth-2, y:30 , w:2, h:ETA.config.stageHeight })
			.collision();
		Crafty.e("Line, 2D, DOM, gridBounds, Color, Collision")
			.color('rgb(30,150,30)')
			.attr({ x:0, y:29 , w:ETA.config.stageWidth, h:2 })
			.collision();
		Crafty.e("Line, 2D, DOM, gridBounds, Color, Collision")
			.color('rgb(30,150,30)')
			.attr({ x:0, y:ETA.config.stageHeight-2 , w:ETA.config.stageWidth , h:2 })
			.collision();
			
		return this;
	}
	
});
