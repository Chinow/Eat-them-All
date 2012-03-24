Crafty.c('SignPop', {
	_pop: 0,
    maxSigns: 3,
   _key: Crafty.keys.ENTER,
	SignPop : function(){
		var pop = this;
		this.requires("SpriteAnimation, Collision")
		.bind('KeyDown', function(e) {
			if (e.key !== this._key) {
				return;
			}
			if(this._pop < this.maxSigns) {
				console.log("keydown");
				 Crafty.e('Sign')
					.attr({ x: 16, y: 304, z: 100 })				
				this._pop++;
			}
		});
		return this;
	}
});
