Crafty.c('Env', {
	init:function(e) {
		this.requires("2D, DOM, SpriteAnimation, Collision")
	},
	display:function(e) {
		this.bind('KeyDow', function(el) {
			if (el.key !== ETA.config.keyDownSign) {
				return;
			}
			if(pop < ETA.config.maxSigns) {
				console.log(el.x + '->' + this.x);
				Crafty.e("Sign, signSprite").attr({ x: this.x,y: this.y, z: 100, w:50, h:50 })			
				pop++;
			}
		});
	}
});
