Crafty.c('Sign', {
	mvt:"none",
	cell:null,
	cellObj:null,
	direction:"none",
	player:null,
	playerIdProprio:null,
	init:function() {
		this.requires("2D, DOM, SpriteAnimation, Collision, Controls")
	},
	sign : function(player){
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
			this.animate("turn_up", [[8,0],[3,0], [2,0], [1,0], [0,0], [11,0]]);
			this.animate("down", [[11,0]]);
		}
		
		var rateBegin 	= ETA.config.frameRate/ETA.config.signBeginAnimationRate;
		var rate 		= ETA.config.frameRate/ETA.config.signAnimationRate;
		
		if (!this.isPlaying("up") && this.mvt == "none")  {
			this.playerIdProprio = this.player.currentCellId;
			this.stop().animate("up", rateBegin, 0);
			this.mvt = (this.player.id == 1) ? "turn_right" : "turn_left";
			this.direction ="n"
			Crafty.audio.play("signCreate");
			this.player.popSign ++;
		};
		
		this.cell = ETA.grid.getCell(this._x+29, this._y+48).id;
		this.cellObj = ETA.grid.getCell(this._x+29, this._y+48);
		this.cellObj.elem = this;
		this.cellObj.elemType = "sign";
		this.bind('KeyDown', function(el) {
			this.cell = ETA.grid.getCell(this._x+29, this._y+48).id;
			this.cellObj = ETA.grid.getCell(this._x+29, this._y+48);
			this.cellObj.elem = this;
			this.cellObj.elemType = "sign";
			
			if(this.player != null && el.key == this.player.actionKey && this.cell == this.player.currentCellId) {
				if (!this.isPlaying("turn_right") && this.mvt =="turn_right")  {
					Crafty.audio.play("signMove");
					this.stop().animate("turn_right", rate, 0);
					this.direction = "e";
					this.mvt = (this.player.id == 1) ? "turn_bottom" : "turn_up";
					return this;
				};
				
				if (!this.isPlaying("turn_bottom") && this.mvt =="turn_bottom")  {
					Crafty.audio.play("signMove");
					this.stop().animate("turn_bottom", rate, 0);
					this.direction = "s";
					this.mvt = (this.player.id == 1) ? "turn_left" : "turn_right";
					return this;
				};
				
				if (!this.isPlaying("turn_left") && this.mvt =="turn_left")  {
					Crafty.audio.play("signMove");
					this.stop().animate("turn_left", rate, 0);
					this.direction = "w";
					this.mvt = (this.player.id == 1) ? "turn_up" : "turn_bottom";
					return this;
				};
				
				if (!this.isPlaying("turn_up") && this.mvt =="turn_up")  {
					Crafty.audio.play("signDelete");
					this.direction = "none";
					this.mvt = "none";
					this.player.popSign --;
					this.cellObj.elem = null;
					this.cellObj.elemType = null;
					this.cellObj = null;
					
					this.stop().animate("turn_up", rate, 0);
					this.timeout(function() {
						this.player = null;
						this.destroy();
					}, (rate * 45) );
					return this;
				};					
			}
		})
		return this;
	}
});
