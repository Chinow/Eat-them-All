Crafty.c('VoodooDoll', {
	init : function() {
		this.requires("2D, DOM, SpriteAnimation, Collision, Controls")
		.collision(new Crafty.polygon([6,22], [47,22], [47,65], [6,65]));
	},
	_pop: 0,
    maxSigns: ETA.config.game.nbSign,
   _key: Crafty.keys.ENTER,
    walking:"none",
	VoodooDoll : function(){
			this.attr({ x: 16, y: 304, z: 1000 })
			.keyboard1Controls(ETA.config.game.dollSpeed)
			//Setup animation
			.animate("walk_right", [[0,0],[1,0],[0,0],[2,0]])
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
				var cell = ETA.grid.getCell(this._x, this._y);
				if(this.inInterval(parseInt(this._x), parseInt(cell.center.x), 15) && this.inInterval(parseInt(this._y), parseInt(cell.center.y), 15)) {
					this.drawSign(cell);
				}			
			})
			.bind('KeyDown', function(el) {
				if (el.key !== this._key) {
					return;
				}
				if(this._pop < this.maxSigns) {
					var rate = ETA.config.frameRate/ETA.config.dollAnimationRate;
					this.stop().animate("summon_sign", rate, 0);
					Crafty.e("Sign, signSprite").attr({ x: this.x,y: this.y, z: 100, w:50, h:50 })			
					this._pop++;
				}
			})
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
		console.log("Enter DrawSign");
		if(this._pop < this.maxSigns) {
			if(cell.attribute('sign')) {
				Crafty.e("Sign, signSprite").attr({x: this.x,y: this.y, z: 100, w:50, h:50 });
				this._pop++;
			}
		}			
	}
	
});
