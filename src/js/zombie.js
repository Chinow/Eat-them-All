Crafty.c('Zombie', {
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, Collision")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
	},
	targetPixel:{x:500, y:250},
	walkingDirection:"e",
	Zombie : function(){
			//.keyboard1Controls(3)
			//Setup animation
			this.animate("walk_right", [[0,0],[1,0],[0,0],[2,0]])
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
			.bind("EnterFrame",this.moveZombi)
		return this;
	},
	moveZombi: function(){
		
		var direction = {x:this.x - this.targetPixel.x , y:this.y - this.targetPixel.y};
		var rate = ETA.config.frameRate/ETA.config.zombiAnimationRate;
		var collide = this.hit('gridBounds');
		var collided = false;
		if(collide){
			var collideLength = collide.length;
			for (var i = 0; i < collideLength; i++) {
				if (collide[i].type == "SAT")
				{
					collided = true;
				}
			}
		}	
		if (!collided)
		{
			this.move(this.walkingDirection,ETA.config.game.zombiSpeed);
			if (this.walkingDirection == "w") {
				if (!this.isPlaying("walk_left"))
					this.stop().animate("walk_left", rate, -1);
			}
			if (this.walkingDirection == "e") {
				if (!this.isPlaying("walk_right"))
					this.stop().animate("walk_right", rate, -1);
			}
			if (this.walkingDirection == "n") {
				if (!this.isPlaying("walk_up"))
					this.stop().animate("walk_up", rate, -1);
			}
			if (this.walkingDirection == "s") {
				if (!this.isPlaying("walk_down"))
					this.stop().animate("walk_down", rate, -1);
			}
		}
	}
});
