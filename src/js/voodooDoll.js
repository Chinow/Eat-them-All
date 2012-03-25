Crafty.c('VoodooDoll', {
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, Collision, Controls")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
	},
	walking:"none",
	popSign: 0,
    id: 0,
    currentCellId:0,
    maxSigns: ETA.config.game.nbSign,
	actionKey: Crafty.keys.ENTER,
	HPLeft: ETA.config.game.hitPointsFortress,
 
    VoodooDoll : function(playerId) {
			this.id = playerId;
			
			// Setup keyboard
			if (this.id == 1) {
				this.keyboard1Controls(ETA.config.game.dollSpeed)
				.attr(ETA.config.p1.startPosition);
				
				this.actionKey = ETA.config.p1.actionKey;
			} else {
				this.keyboard2Controls(ETA.config.game.dollSpeed)
				.attr(ETA.config.p2.startPosition);
				
				this.actionKey = ETA.config.p2.actionKey;
			}
			
			//Setup animation
			this.animate("walk_right", [[0,0],[1,0],[0,0],[2,0]])
			.animate("walk_left", [[3,0],[4,0],[3,0],[5,0]])
			.animate("walk_up", [[9,0],[10,0],[9,0],[11,0]])
			.animate("walk_down", [[6,0],[7,0],[6,0],[8,0]])
			.animate("summon_sign", [[12,0],[13,0],[13,0],[12,0],[0,0]])
			//Change direction when 
			.bind("NewDirection", function (direction) {
				var rate = ETA.config.frameRate/ETA.config.dollAnimationRate;
				if (!this.isPlaying("summon_sign"))
				{
					if (direction.x < 0) {
						if (!this.isPlaying("walk_left"))
						{
							this.stop().animate("walk_left", rate, -1);
							this.walking = "left"
						}
					}
					if (direction.x > 0) {
						if (!this.isPlaying("walk_right"))
						{
							this.stop().animate("walk_right", rate, -1);
							this.walking = "right"
						}
					}
					if (direction.y < 0) {
						if (!this.isPlaying("walk_up"))
						{
							this.stop().animate("walk_up", rate, -1);
							this.walking = "up"
						}
					}
					if (direction.y > 0) {
						if (!this.isPlaying("walk_down"))
						{
							this.stop().animate("walk_down", rate, -1);
							this.walking = "down"
						}
					}
					if(!direction.x && !direction.y) {
						this.stop();
						this.walking = "none"
					}
				}
			})
			.onHit("gridBounds", function () {
				//Move unit out of solid tile
			})
			.bind('Moved', function(from) {
				var collide = this.hit('dollGridBounds');
				if(collide){
					var collideLength = collide.length;
					for (var i = 0; i < collideLength; i++) {
						if (collide[i].type == "SAT")
						{
							this.attr({x: from.x, y:from.y});
						}
					}
				}
				
				this.currentCellId = ETA.grid.getCell(this._x+29, this._y+48).id;
				this.z = this.y;
				
				if (this.isPlaying("summon_sign"))
				{
					this.attr({x: from.x, y:from.y});
					return;
				}
				if (this.walking != "none")
				{
					var rate = ETA.config.frameRate/ETA.config.dollAnimationRate;
					if (this.walking == "left" && !this.isPlaying("walk_left"))
					{
						this.stop().animate("walk_left", rate, -1);
						this.walking = "left"
					}
					if (this.walking == "right" && !this.isPlaying("walk_right"))
					{
						this.stop().animate("walk_right", rate, -1);
						this.walking = "right"
					}
					if (this.walking == "up" && !this.isPlaying("walk_up"))
					{
						this.stop().animate("walk_up", rate, -1);
						this.walking = "up"
					}
					if (this.walking == "down" && !this.isPlaying("walk_down"))
					{
						this.stop().animate("walk_down", rate, -1);
						this.walking = "down"
					}
				}
				
		
			})
			.bind('KeyDown', function(el) {
				if (el.key !== this.actionKey) {
					return;
				}
				var rate = ETA.config.frameRate/ETA.config.dollAnimationRate;
				this.stop().animate("summon_sign", rate, 0);
				var cell = ETA.grid.getCell(this._x+29, this._y+48);
				if (!cell.elem) {
					console.log("toto");
					this.drawSign(cell);	
				}
			})
		
		this.currentCellId = ETA.grid.getCell(this._x+29, this._y+48).id;
		
		return this;
	},
	
	inInterval: function(x, y, z) {
		if(parseInt(y) > parseInt(x-z) && parseInt(y)  < parseInt(x+z) ) {
			return true;
		}else{
			return false;
		} 
	},
	
	drawSign : function(cell) {
		console.log("Draw Sign");
		if(this.id ==1) {
			var signSprite 	= "signRougeSprite";
		}else{
			var signSprite 	= "signBleuSprite";
		}
		if(this.popSign < ETA.config.game.nbSign) {
			if(cell.attribute('sign')) {
				Crafty.e("Sign, " + signSprite).attr({
					x: cell.center.x - 10,
					y: cell.center.y - 35,
					z: cell.center.y - 35,
					w: 65,
					h: 65
				}).sign(this);
			}
			this.z = this.y;
		}		
	},
	youLose : function(){
		this.destroy();
	}
	
	
});
