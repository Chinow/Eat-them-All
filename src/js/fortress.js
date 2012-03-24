Crafty.c('Fortress', {
	Zombie : function(){
			this.requires("solid, SpriteAnimation, Collision")
			.onHit("solid", function () {
					//Move unit out of solid tile
			})
			.bind('Moved', function(from) {
				if(this.hit('solid')){
					this.attr({x: from.x, y:from.y});
			}
		})
		return this;
	}
	
});
