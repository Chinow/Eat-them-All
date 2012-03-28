Crafty.c('Sign', {

	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	type: SIGN,
	mvt: NONE,
	cell: null,
	direction: NONE,
	player: null,
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init:function() {
		this.requires("2D, DOM, SpriteAnimation, Collision, Controls");
		this._globalZ = 9;
	},
	
	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	sign: function(player){
		this.player = player;
		
		if (this.player.id == 1) {
			this.animate("up", [[0,0],[1,0],[2,0],[3,0]]);
			this.animate("turn_right", [[4,0],[5,0]]);
			this.animate("turn_bottom", [[6,0],[7,0]]);
			this.animate("turn_left", [[8,0],[9,0]]);
			this.animate("turn_up", [[10,0],[3,0], [2,0], [1,0], [0,0], [11,0]]);
			this.animate("down", [[11,0]]);
		} else {
			this.animate("up", [[0,0],[1,0],[2,0],[3,0]]);
			this.animate("turn_left", [[10,0],[9,0]]);
			this.animate("turn_bottom", [[8,0],[7,0]]);
			this.animate("turn_right", [[6,0],[5,0]]);
			this.animate("turn_up", [[4,0],[3,0], [2,0], [1,0], [0,0], [11,0]]);
			this.animate("down", [[11,0]]);
		}
		
		var rateBegin = ETA.config.frameRate/ETA.config.signBeginAnimationRate;
		
		Crafty.audio.play("signCreate");
		this.stop().animate("up", rateBegin, 0);
		this.direction = NORTH;
		this.mvt = (this.player.id == 1) ? "turn_right" : "turn_left";
		this.player.popSign++;
		
		this.cell = ETA.grid.getCell(this._x + 29, this._y + 48);
		this.cell.elem = this;
	},
	
	//-----------------------------------------------------------------------------
	//	Method - rotate
	//-----------------------------------------------------------------------------
	
	rotateSign: function() {
		var rate = ETA.config.frameRate / ETA.config.signAnimationRate;
		
		if (!this.isPlaying("turn_right") && this.mvt == "turn_right")  {
			Crafty.audio.play("signMove");
			this.stop().animate("turn_right", rate, 0);
			this.direction = EAST;
			this.mvt = (this.player.id == 1) ? "turn_bottom" : "turn_up";
		} else if (!this.isPlaying("turn_bottom") && this.mvt == "turn_bottom")  {
			Crafty.audio.play("signMove");
			this.stop().animate("turn_bottom", rate, 0);
			this.direction = SOUTH;
			this.mvt = (this.player.id == 1) ? "turn_left" : "turn_right";
		} else if (!this.isPlaying("turn_left") && this.mvt == "turn_left")  {
			Crafty.audio.play("signMove");
			this.stop().animate("turn_left", rate, 0);
			this.direction = WEST;
			this.mvt = (this.player.id == 1) ? "turn_up" : "turn_bottom";
		} else if (!this.isPlaying("turn_up") && this.mvt == "turn_up")  {
			Crafty.audio.play("signDelete");
			this.direction = NONE;
			this.mvt = NONE;
			this.player.popSign--;
			
			this.stop().animate("turn_up", rate, 0);
			this.timeout(function() {
				this.cell.elem = null;
				this.destroy();
			}, (rate * 45) );
		}
	}
});
