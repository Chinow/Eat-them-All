Crafty.c('BGGrid', {
	width:0,
	height:0,
	cells: [],
	init : function(){
		cells = [];
		cells[0] = [];
		cells[0][0] = Crafty.e("2D, DOM, bg")
			.attr({ x:0 , y:0, z:1 });
		return this;
	},
	grid: function(){
		return this;
	}
	
});
