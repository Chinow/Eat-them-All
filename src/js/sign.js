Crafty.c('Sign', {
	mvt:"none",
	cell:null,
	player:null,
	init:function() {
		this.requires("2D, DOM, SpriteAnimation, Collision, Controls")
	},
	sign : function(player){
		this.player = player;
		
		this.animate("up", [[0,0],[1,0],[2,0],[3,0]]);
		this.animate("turn_right", [[4,0],[5,0]]);
		this.animate("turn_bottom", [[6,0],[7,0]]);
		this.animate("turn_left", [[8,0],[9,0]]);
		this.animate("turn_up", [[10,0],[3,0], [2,0], [1,0], [0,0], [11,0]]);
		this.animate("down", [[11,0]]);
		var rateBegin 	= ETA.config.frameRate/ETA.config.signBeginAnimationRate;
		var rate 		= ETA.config.frameRate/ETA.config.signAnimationRate;
		if (!this.isPlaying("up") && this.mvt =="none")  {
			this.stop().animate("up", rateBegin, 0);
			this.mvt  = "turn_right";
			Crafty.audio.play("signCreate", 0);
		};
		this.bind('KeyDown', function(el) {
			this.cell = ETA.grid.getCell(this._x+29, this._y+48).id;
						
			if(el.key == this.player.actionKey &&  this.cell == this.player.currentCellId) {
				if (!this.isPlaying("up") && this.mvt =="none")  {
					Crafty.audio.play("signCreate", 0);
					this.stop().animate("up", rateBegin, 0);
					this.mvt  = "turn_right";
					return this;
				};
				
				if (!this.isPlaying("turn_right") && this.mvt =="turn_right")  {
					Crafty.audio.play("signMove", 0);

					this.stop().animate("turn_right", rate, 0);
					this.mvt = "turn_bottom";
					return this;
				};
				
				if (!this.isPlaying("turn_bottom") && this.mvt =="turn_bottom")  {
					Crafty.audio.play("signMove", 0);
					this.stop().animate("turn_bottom", rate, 0);
					this.mvt = "turn_left";
					return this;
				};
				
				if (!this.isPlaying("turn_left") && this.mvt =="turn_left")  {
					Crafty.audio.play("signDelete", 0);
					this.stop().animate("turn_left", rate, 0);
					this.mvt = "turn_up";
					return this;
				};
				
				if (!this.isPlaying("turn_up") && this.mvt =="turn_up")  {
					this.stop().animate("turn_up", rate, 0);
					this.mvt = "none";
					return this;
				};
			}
		})

		return this;
	}
});
