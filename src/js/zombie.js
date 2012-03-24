Crafty.c('Zombie', {
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, Collision")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
	},
	Zombie : function(){
			this.attr({ x: 16, y: 304, z: 1000 })
			//.keyboard1Controls(3)
			//Setup animation
			.animate("walk_right", [[0,0],[1,0],[0,0],[2,0]])
			.animate("walk_left", [[3,0],[4,0],[3,0],[5,0]])
			.animate("walk_up", [[9,0],[10,0],[9,0],[11,0]])
			.animate("walk_down", [[6,0],[7,0],[6,0],[8,0]])
			.onHit("gridBounds", function () {
				//Move unit out of solid tile
			})
			.bind('Moved', function(from) {
				var collide = this.hit('gridBounds');
				if(collide){
					var collideLength = collide.length;
					for (var i = 0; i < collideLength; i++) {
						if (collide[i].type == "SAT")
						{
							this.attr({x: from.x, y:from.y});
						}
					}
				}			
			})
		Crafty.bind("EnterFrame",this.moveZombi)
		return this;
	},
	moveZombi: function(){
		var direction = {x:1, y:0};
		var rate = ETA.config.frameRate/ETA.config.animationRate;
		if(!this.isPlaying)
			return;
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
	}
});
