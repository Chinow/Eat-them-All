Crafty.c('Zombie', {
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, Collision")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
	},
	targetPixel:{x:500, y:250},
	currentCell:null,
	walkingDirection:"s",
	playerId: 0,
	Zombie : function(playerId){
			this.playerId = playerId;
			this.walkingDirection = (playerId == 1) ? "e" : "w";
			
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
				/*collide = this.hit('fortress')
				if (collide){
					var collideLength = collide.length;
					for (var i = 0; i < collideLength; i++) {
						if (collide[i].type == "SAT")
						{
							this.attr({x: from.x, y:from.y});
						}
					}
				}*/
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
				var signPresent = false;
				var signDirection = "none";
				
				if (this.currentCell.elemType == "sign" && this.currentCell.elem.direction != "none") {
					signPresent = true;
					signDirection =  this.currentCell.elem.direction;
				}
				
				// Have sign
				if (signPresent) {
					// Sign and upper border
					if (!(this.currentCell.upperCell && signDirection == "n"
					|| this.currentCell.lowerCell && signDirection == "s")) {
						this.walkingDirection = signDirection;
					}
				}
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
				var signPresent = false;
				var signDirection = "none";
				
				if (this.currentCell.elemType == "sign" && this.currentCell.elem.direction != "none") {
					signPresent = true;
					signDirection =  this.currentCell.elem.direction;
				}
				if (this.currentCell.elemType == "fortress" ) {
					this.currentCell.elem.hitPoints--;
					this.destroy();
					//signPresent = true;
					//signDirection =  this.currentCell.elem.direction;
				}
				
				// Have sign
				if (signPresent) {
					// Sign and upper border
					if (this.currentCell.upperCell && signDirection == "n") {
						if (this.walkingDirection == "n") {
							this.walkingDirection = (Crafty.math.randomInt(1, 2) == 1) ? "w" : "e";
						}
					}
					// Sign and lower border
					else if (this.currentCell.lowerCell && signDirection == "s") {
						if (this.walkingDirection == "s") {
							this.walkingDirection = (Crafty.math.randomInt(1, 2) == 1) ? "w" : "e";
						}
					}
					// Sign
					else {
						this.walkingDirection = signDirection;
					}
				}
				// No sign
				else {
					// Upper border
					if (this.currentCell.upperCell && this.walkingDirection == "n") {
						this.walkingDirection = (Crafty.math.randomInt(1, 2) == 1) ? "w" : "e";
					}
					// Lower border
					else if (this.currentCell.lowerCell && this.walkingDirection == "s") {
						this.walkingDirection = (Crafty.math.randomInt(1, 2) == 1) ? "w" : "e";
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
		}else
		{
			this.stop();
		}
		var newCell = ETA.grid.getCell(this.x + this.w/2, this.y + this.h/2);
		if (newCell != this.currentCell)
		{
			// check new cell content
			this.currentCell = newCell;
		}
	}
});
