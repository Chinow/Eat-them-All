Crafty.c('finalTribute', {
	init:function() {
		this.requires("2D, DOM, finalTribute, SpriteAnimation");
	},
	finalTribute : function(){
		this.animate("up", [[0,0],[1,0]]);
		this.stop().animate("up", 40, -1);
		return this;
	}
});
