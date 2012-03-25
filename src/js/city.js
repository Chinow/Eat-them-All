Crafty.c('City', {
	nbGards:0,
	frames:0,
	outFrames: 0,
	nbHumans: 0,
	maxHumans:0,
	playerId:0,
	life:null,
	text:null,
	hudHeight:0,
	hudXOffset:0,
	hudYOffset:0,
	textOffsetX:null,
	doorsOpen: false,
	init: function() {
		this.requires("2D, DOM, city, SpriteAnimation");
		return this;
	},
	City : function(cellX, cellY, size) {
		this.cell = ETA.grid.cells[cellX][cellY];
		this.z = this.y;
		this.animate("neutral", [[0,0],[0,0]]);
		this.animate("blue", [[1,0],[1,0]]);
		this.animate("red", [[2,0],[2,0]]);
		this.animate("neutralDead", [[3,0],[3,0]]);
		this.animate("blueDead", [[4,0],[4,0]]);
		this.animate("redDead", [[5,0],[5,0]]);

		if (size == "hameau")
		{
			this.hudHeight = 14;
			this.hudXOffset = 39;
			this.hudYOffset = 27;
			this.textOffsetX = -11;
			this.nbGards = ETA.config.game.nbGuardsHameau;
			this.nbHumans = ETA.config.game.nbHumansHameau;
			this.maxHumans = ETA.config.game.nbHumansHameau;
		}
		else if (size == "village")
		{
			this.hudHeight = 24;
			this.hudXOffset = 32
			this.hudYOffset = 17;
			this.textOffsetX = -17;
			this.nbGards = ETA.config.game.nbGuardsVillage;
			this.nbHumans = ETA.config.game.nbHumansVillage;
			this.maxHumans = ETA.config.game.nbHumansVillage;
		}
		else if (size == "ville")
		{
			this.hudHeight = 37;
			this.hudXOffset = 32;
			this.hudYOffset = 4;
			this.textOffsetX = -17;
			this.nbGards = ETA.config.game.nbGuardsVille;
			this.nbHumans = ETA.config.game.nbHumansVille;
			this.maxHumans = ETA.config.game.nbHumansVille;
		}
		
		

		this.cell.elem = this;
		this.cell.elemType = "city";
		this.animate("neutral",10, 1);
		this.attr({ x: this.cell.x, y: this.cell.y-25, z: this.cell.y-25 });
		this.drawLife();
		this.drawText();
		this.bind("EnterFrame", this.procreate);
		return this;
	},
	loseGuard : function (value){
		this.nbGards = this.nbGards - value;
		this.text.destroy();
		this.drawText();
		
		/*if (this.nbGards == 0) {
			this.changePlayed(0);
		}*/
	},
	gainGuards : function (value){
		this.nbGards = this.nbGards + value;
		if(this.nbGards > 99)
			this.nbGards = 99;
			
		this.text.destroy();
		this.drawText();
	},
	changePlayed : function(playerId){
		this.doorsOpen = false;
		this.playerId = playerId;
		
		if (playerId > 0) {
			this.gainGuards(1);
		}
		
		this.updateSprite();
	},
	updateSprite: function() {
		var spriteAnimation;
		
		if (this.playerId == 0) {
			spriteAnimation = "neutral";
		} else if (this.playerId == 1) {
			spriteAnimation = "red";
		} else if (this.playerId == 2) {
			spriteAnimation = "blue";
		}
		
		if (this.nbHumans == 0) {
			spriteAnimation += "Dead";
		}
		
		this.stop().animate(spriteAnimation, 10, 1);
	},
	drawLife: function()
	{
		var ratio = this.nbHumans/this.maxHumans;
		var color;
		if (ratio > 0.66)
			color = 'rgb(0,255,0)';
		else if (ratio < 0.33)
			color = 'rgb(255,0,0)';
		else
			color = 'rgb(240,195,0)';
		if (this.life)
			this.life.destroy();
		this.life = Crafty.e("2D, DOM, Color")
					.color(color)
					.attr({ x: this.cell.x +this.hudXOffset, y: this.cell.y+this.hudYOffset + (this.hudHeight -this.hudHeight*ratio+1), z:this.cell.y-25, w: 3, h:this.hudHeight*ratio});
	},
	drawText: function()
	{
		this.text = Crafty.e("2D, DOM, Text").attr({ w: 15, h: 20, x: this.cell.center.x+this.textOffsetX, y: this.cell.center.y-29, z:this.cell.y-25 })
				.text(this.nbGards+"")
				.css({ "text-align": "center", "color" : "#fff", "font-family":"arial" , "font-weight":"bold", "font-size":"12px"});
	},
	switchDoorState: function() {
		this.doorsOpen = !this.doorsOpen;
		
		if (this.doorsOpen) {
			Crafty.audio.play("doorOpen");
		} else {
			Crafty.audio.play("doorClose");
		}
	},
	procreate: function()
	{
		if (this.nbHumans > 0) {
			if (this.playerId == 0 && this.nbHumans < this.maxHumans)
			{
				rand = Crafty.math.randomNumber(0, 1);
				proclimit = ETA.config.game.procreationSpeed * this.nbHumans/ETA.config.frameRate
				if (proclimit > rand)
				{
					this.nbHumans ++;
					this.drawLife();
				}
			}
			
			if (this.playerId != 0 && this.nbGards > 0)
			{
				this.frames++;
				if(this.maxHumans == ETA.config.game.nbHumansHameau) {
					if (this.frames ==180)
					{
						this.nbHumans --;
						this.gainGuards(1);
						this.drawLife();
						this.frames = 0;
					}
				}
				else if(this.maxHumans == ETA.config.game.nbHumansVillage)
				{
					if (this.frames ==120)
					{
						this.nbHumans --;
						this.gainGuards(1);
						this.drawLife();
						this.frames = 0;
					}
				}
				else if(this.maxHumans == ETA.config.game.nbHumansVille)
				{
					if (this.frames ==60)
					{
						this.nbHumans --;
						this.gainGuards(1);
						this.drawLife();
						this.frames = 0;
					}
				}
				
				if (this.nbHumans == 0) {
					this.updateSprite();
				}
			}
		}
		
		if (this.doorsOpen && this.nbGards > 0) {
			if (++this.outFrames >= ETA.config.game.timeGetOutFortress * ETA.config.frameRate) {
				this.loseGuard(1);
				this.outFrames = 0;
				
				var spriteName;
				var xoffset;
				
				if (this.playerId == 1) {
					spriteName = "zombieRougeSprite";
					xoffset = 50;
				} else {
					spriteName = "zombieBleuSprite";
					xoffset = -50;
				}
				
				Crafty.e("Zombie, " + spriteName)
					.Zombie(this.playerId)
					.attr({ x: this.x + xoffset, y: this.y, z:900 });
			}
		}
	}
});

