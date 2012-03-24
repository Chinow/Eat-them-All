Crafty.c('Zombie', {
	_pop: 0,
    maxSigns: 3,
   _key: Crafty.keys.ENTER,
	init:function(e) {
		this.requires("2D, DOM, SpriteAnimation, Collision")
	},
	Zombie : function(){
		//Setup animation
		this.animate("walk_right", [[0,0],[1,0],[0,0],[2,0]])
		.animate("walk_left", [[3,0],[4,0],[3,0],[5,0]])
		.animate("walk_up", [[9,0],[10,0],[9,0],[11,0]])
		.animate("walk_down", [[6,0],[7,0],[6,0],[8,0]])
		//Change direction when 
		.bind("NewDirection", function (direction) {
			var rate = ETA.config.frameRate/ETA.config.animationRate;
			if (direction.x < 0) {
				if (!this.isPlaying("walk_left"))
					this.stop().animate("walk_left", rate, -1);
			}
			if (direction.x > 0) {
				if (!this.isPlaying("walk_right"))
					this.stop().animate("walk_right", rate, -1);
			}
			if (direction.y < 0) {
				if (!this.isPlaying("walk_up"))
					this.stop().animate("walk_up", rate, -1);
			}
			if (direction.y > 0) {
				if (!this.isPlaying("walk_down"))
					this.stop().animate("walk_down", rate, -1);
			}
			if(!direction.x && !direction.y) {
				this.stop();
			}
		})
		.onHit("solid", function () {
				//Move unit out of solid tile
		})
		.bind('Moved', function(from) {
			if(this.hit('solid')){
				this.attr({x: from.x, y:from.y});
			}
		})
		.bind('KeyDown', function(el) {
			if (el.key !== this._key) {
				return;
			}
			if(this._pop < this.maxSigns) {
				console.log("keydown");
				Crafty.e("Sign, signSprite").attr({ x: this.x,y: this.y, z: 100, w:50, h:50 })			
			}
		})
		return this;
	}
});
