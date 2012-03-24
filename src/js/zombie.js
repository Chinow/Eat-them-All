Crafty.c('Zombie', {
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, Collision")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
	},
	targetPixel:{x:500, y:250},
	currentCell:null,
	walkingDirection:"s",
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
				/*if(collide){
					var collideLength = collide.length;
					for (var i = 0; i < collideLength; i++) {
						if (collide[i].type == "SAT")
						{
							this.attr({x: from.x, y:from.y});
						}
					}
				}	*/		
			})
			.bind("EnterFrame",this.moveZombi)
		return this;
	},
	moveZombi: function(){
		this.z = this.y;
		if (!this.currentCell)
			this.currentCell = ETA.grid.getCell(this.x + this.w/2 - 5, this.y + this.h/2+10);
		var direction = {x:this.x + this.w/2 -5 - this.currentCell.center.x , y:this.y + this.h/2+10 - this.currentCell.center.y};
		
		if (this.walkingDirection == "w" || this.walkingDirection == "e")
		{
			if (direction.y > 1)
				this.move("n",1);
			else if (direction.y < -1)
				this.move("s",1);
				
			var dx = this.x + this.w/2 -5 - this.currentCell.center.x
			if (dx < 5 && dx > -5)
			{
				//check sign
			}
		}
		else if (this.walkingDirection == "s" || this.walkingDirection == "n")
		{
			if (direction.x > 1)
				this.move("w",1);
			else if (direction.x < -1)
				this.move("e",1);
				
			var dy = this.y + this.h/2 + 10 - this.currentCell.center.y;
			

			
			if (dy < 5 && dy > -5)
			{
				//check sign
				//if (this.currentCell.)
				//{
					
				//}
				//if no sign
				//else
				 if (this.currentCell.borderCell)
				{
					var direction = Crafty.math.randomInt(1, 2);
					if (direction == 1)
					{
						this.walkingDirection = "w";
					}else{
						this.walkingDirection = "e";
					}
				}
			}
		}
		/*if (direction.x > 0)
			this.walkingDirection = "w";
		if (direction.x < 0)
			this.walkingDirection = "e";
		*/
		var rate = ETA.config.frameRate/ETA.config.zombiAnimationRate;
		var collide = this.hit('gridBounds');
		var collided = false;
		if(collide){
			var collideLength = collide.length;
			for (var i = 0; i < collideLength; i++) {
				if (collide[i].type == "SAT")
				{
					collided = true;
					break;
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
		var newCell = ETA.grid.getCell(this.x + this.w/2, this.y + this.h/2);
		if (newCell != this.currentCell)
		{
			// check new cell content
			this.currentCell = newCell;
		}
	}
});
