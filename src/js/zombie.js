Crafty.c('Zombie', {
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, zombi, Collision")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
        this._globalZ=7;
	},
	targetPixel:{x:500, y:250},
	currentCell:null,
	walkingDirection:"s",
	spawningImunity:true,
	spawning: true,
	dying: false,
	playerId: 0,
	rate: ETA.config.frameRate / ETA.config.zombiAnimationRate,
	Zombie : function(playerId){
		this.playerId = playerId;
		this.walkingDirection = (playerId == 1) ? "e" : "w";
		
		//.keyboard1Controls(3)
		//Setup animation
		this.animate("spawn", [[12,0],[13,0],[14,0]])
		.animate("die", [[14,0],[13,0],[12,0]])
		.animate("walk_right", [[0,0],[1,0],[0,0],[2,0]])
		.animate("walk_left", [[3,0],[4,0],[3,0],[5,0]])
		.animate("walk_up", [[9,0],[10,0],[9,0],[11,0]])
		.animate("walk_down", [[6,0],[7,0],[6,0],[8,0]])
		.animate("hit_fortress_right", [[0,0],[6,0],[3,0],[9,0]])
		.animate("hit_fortress_left", [[0,0],[6,0],[3,0],[9,0]])
		.onHit("gridBounds", function () {
			//Move unit out of solid tile
		})
		.bind('Moved', function(from) {
			if (!this.spawning && !this.dying) {
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
			}
		})
		.bind("EnterFrame", this.moveZombi);
		
		this.animate("spawn", this.rate);
		return this;
	},
	moveZombi: function(){
		if (this.spawning && !this.isPlaying("spawn")) {
			this.spawning = false;
		}
		
		if (this.dying && !this.isPlaying("die")) {
			this.destroy();
		}
		
		if (!this.dying) {
			this.z = this.y;
			if (!this.currentCell)
				this.currentCell = ETA.grid.getCell(this.x + this.w/2 - 5, this.y + this.h/2+10);
			var direction = {x:this.x + this.w/2 -5 - this.currentCell.center.x , y:this.y + this.h/2+10 - this.currentCell.center.y};
			var hittingFortress=false;
			var hittingCemetery=false;
			if (this.walkingDirection == "w" || this.walkingDirection == "e")
			{
				if (direction.y > 1)
					this.move("n",1);
				else if (direction.y < -1)
					this.move("s",1);
					
				if (this.currentCell.elemType == "fortress" ) {
					if (this.playerId == this.currentCell.elem.player.id)
					{
						if (this.walkingDirection == "e" )
							this.walkingDirection = "w" 
						else if (this.walkingDirection == "w" )
							this.walkingDirection = "e" 
							
					}else{
						this.currentCell.elem.loseHP(ETA.config.game.zombiDPS);
						hittingFortress = true;
					}
					
					//signPresent = true;
					//signDirection =  this.currentCell.elem.direction;
				}
				
				if (this.currentCell.elemType == "cemetry" && !this.spawningImunity) {
					if (this.playerId == this.currentCell.elem.playerId)
					{
						if (this.walkingDirection == "e" )
							this.walkingDirection = "w" 
						else if (this.walkingDirection == "w" )
							this.walkingDirection = "e" 
							
					}else{
						hittingCemetery = true;
					}
					
					//signPresent = true;
					//signDirection =  this.currentCell.elem.direction;
				}
				
				if (this.currentCell.elemType == "city") {
					if (this.currentCell.elem.playerId != this.playerId)
					{
						if (this.currentCell.elem.nbGards <= 0)
						{
							this.currentCell.elem.changePlayed(this.playerId)
							this.destroy();
							return;
						}
						else
						{
							this.currentCell.elem.loseGuard(1);
							this.die();
							return;
						}
					}
					else if (this.playerId == this.currentCell.elem.playerId)
					{
						this.currentCell.elem.gainGuards(1);
							this.destroy();
							return;
					}
				}
					
				var dx = this.x + this.w/2 -5 - this.currentCell.center.x
				if (dx < 5 && dx > -5)
				{
					var signPresent = false;
					var signDirection = "none";
					
					if (this.currentCell.elemType == "sign" && this.currentCell.elem.direction != "none"
					&& this.currentCell.elem.player.id == this.playerId) {
	
						signPresent = true;
						signDirection =  this.currentCell.elem.direction;
					} else {
						var signPresent = false;
						var signDirection = "none";
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
						
				if (this.currentCell.elemType == "city") {
					if (this.currentCell.elem.playerId == 0)
					{
						if (this.currentCell.elem.nbGards <= 0)
						{
							this.currentCell.elem.changePlayed(this.playerId)
							this.die();
							return;
						}
						else
						{
							this.currentCell.elem.loseGuard(1);
							this.die();
							return;
						}
					}
					else if (this.playerId == this.currentCell.elem.playerId)
					{
						this.currentCell.elem.gainGuards(1);
							this.die();
							return;
					}
				}
					
				var dy = this.y + this.h/2 + 10 - this.currentCell.center.y;
				
				if (dy < 5 && dy > -5) {
					if (this.currentCell.elemType == "sign" && this.currentCell.elem.direction != "none"
					&& this.currentCell.elem.player.id == this.playerId) {
						signPresent = true;
						signDirection =  this.currentCell.elem.direction;
					} else {
						var signPresent = false;
						var signDirection = "none";
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
			var collide2 = this.hit('zombi');
			var collided2 = false;
			if(collide2){
				var collideLength = collide2.length;
				for (var i = 0; i < collideLength; i++) {
					if (collide2[i].type == "SAT")
					{
						if (collide2[i].obj.playerId != this.playerId)
						{
							if (!this.dying && !collide2[i].obj.dying)
							collide2[i].obj.die();
							this.die();
							return;
						}
					}
				}
			}
			if (!collided && !hittingFortress && !hittingCemetery)
			{
				if (!this.spawning) {
					this.move(this.walkingDirection,ETA.config.game.zombiSpeed);
					
					if (this.walkingDirection == "w") {
						if (!this.isPlaying("walk_left"))
							this.stop().animate("walk_left", this.rate, -1);
					}
					if (this.walkingDirection == "e") {
						if (!this.isPlaying("walk_right"))
							this.stop().animate("walk_right", this.rate, -1);
					}
					if (this.walkingDirection == "n") {
						if (!this.isPlaying("walk_up"))
							this.stop().animate("walk_up", this.rate, -1);
					}
					if (this.walkingDirection == "s") {
						if (!this.isPlaying("walk_down"))
							this.stop().animate("walk_down", this.rate, -1);
					}
				}
			}else
			{
				if (hittingFortress)
				{
					if (this.playerId == 2) {
						if (!this.isPlaying("hit_fortress_left"))
							this.stop().animate("hit_fortress_left", this.rate, -1);
					}
	
					if (this.playerId == 1) {
						if (!this.isPlaying("hit_fortress_right"))
							this.stop().animate("hit_fortress_right", this.rate, -1);
					}
				}else
				{
					this.stop();
				}
			}
			var newCell = ETA.grid.getCell(this.x + this.w/2, this.y + this.h/2);
			if (newCell != this.currentCell)
			{
				this.spawningImunity = false;
				// check new cell content
				this.currentCell = newCell;
			}
		}
	},
	die: function() {
		//if (!this.dying) {
			this.dying = true;
//			if (!this.isPlaying("die"))
				this.stop().animate("die", this.rate, 0);
			
			/*this.timeout(function() {
				this.destroy();
			}, (this.rate * 45) );*/
			//this.destroy();
		//}
	}
});
