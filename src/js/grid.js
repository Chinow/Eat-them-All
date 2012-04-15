Crafty.c('BGGrid', {

	//-----------------------------------------------------------------------------
	//	Attributes
	//-----------------------------------------------------------------------------
	
	width: 0,
	height: 0,
	cells: [],
	background : {},
	
	//-----------------------------------------------------------------------------
	//	Init
	//-----------------------------------------------------------------------------
	
	init : function(){
		this.cells = [];
		
		background = Crafty.e("2D, DOM, bg")
			.attr({ x:0 , y:0, z:-1 });
		
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Constructor
	//-----------------------------------------------------------------------------
	
	grid: function(w, h){
		this.width = w;
		this.height = h;
		var id = 1;
		
		for (var i = 0; i < w; i++) {
			this.cells[i] = [];
			
			for (var j = 0; j < h; j++) {
				this.cells[i][j] = Crafty.e("Cell")
					.attr({
						x: i * ETA.config.scene.tile.width,
						y: j * ETA.config.scene.tile.height + 30,
						w: ETA.config.scene.tile.width,
						h: ETA.config.scene.tile.height
					})
					.cell(id);
				
				if (j == h-1) {
					this.cells[i][j].lowerCell = true;
				}
				
				if (j == 0) {
					this.cells[i][j].upperCell = true;
				}
				
				id ++;
			}
		}
		
		Crafty.e("Line, 2D, DOM, gridBounds, Collision")
			.attr({ x:0, y:30 , w:2, h:ETA.config.stageHeight })
			.collision();
		Crafty.e("Line, 2D, DOM, gridBounds, Collision")
			.attr({ x:ETA.config.stageWidth-2, y:30 , w:2, h:ETA.config.stageHeight })
			.collision();
		Crafty.e("Line, 2D, DOM, dollGridBounds, Collision")
			.attr({ x:0, y:30 , w:2, h:ETA.config.stageHeight })
			.collision();
		Crafty.e("Line, 2D, DOM, dollGridBounds, Collision")
			.attr({ x:ETA.config.stageWidth-2, y:30 , w:2, h:ETA.config.stageHeight })
			.collision();
		Crafty.e("Line, 2D, DOM, dollGridBounds, Collision")
			.attr({ x:0, y:29 , w:ETA.config.stageWidth, h:2 })
			.collision();
		Crafty.e("Line, 2D, DOM, dollGridBounds, Collision")
			.attr({ x:0, y:ETA.config.stageHeight-2 , w:ETA.config.stageWidth , h:2 })
			.collision();
			
		return this;
	},
	
	//-----------------------------------------------------------------------------
	//	Methods - Game over
	//-----------------------------------------------------------------------------
	
	gridGameOver: function(looser){
		Crafty.audio.play("gameOver");
		Crafty.sprite(290, "img/GameOverScreen_VicoryText.png", {
			endTextSpriteVictory: [0, 0],
			endTextSpriteDefeat: [1, 0]
		});
		Crafty.sprite(291, "img/GameOverScreen_RedVictory.png", {
			redSpriteVictory: [0, 0]
		});
		Crafty.sprite(291, "img/GameOverScreen_RedDefeat.png", {
			redSpriteDefeat: [0, 0]
		});
		Crafty.sprite(289, "img/GameOverScreen_BlueVictory.png", {
			blueSpriteVictory: [0, 0]
		});
		Crafty.sprite(289, "img/GameOverScreen_BlueDefeat.png", {
			blueSpriteDefeat: [0, 0]
		});
				
		Crafty.sprite(220, "img/Title_EatEmAll.png", {
			endEAT: [0, 0]
		});
		
		Crafty.sprite(285, "img/GameOverScreen_StatsText.png", {
			statsText: [0, 0]
		});
		
		if (looser.id == 1) {
			Crafty.e("endText, endTextSpriteVictory").attr({ w: 290, h: 120, x: 630, y: 220});
			Crafty.e("endText, endTextSpriteDefeat").attr({ w: 290, h: 120, x: 90, y: 220});
			Crafty.e("finalTribute, redSpriteDefeat").attr({ w: 290, h: 220, x: 90, y: 0}).finalTribute();
			Crafty.e("finalTribute, blueSpriteVictory").attr({ w: 290, h: 220, x: 620, y: 0}).finalTribute();
		} else {
			Crafty.e("endText, endTextSpriteVictory").attr({ w: 290, h: 120, x: 90, y: 220});
			Crafty.e("endText, endTextSpriteDefeat").attr({ w: 290, h: 120, x: 630, y: 220});
			Crafty.e("finalTribute, redSpriteVictory").attr({ w: 290, h: 220, x: 90, y: 0}).finalTribute();
			Crafty.e("finalTribute, blueSpriteDefeat").attr({ w: 290, h: 220, x: 620, y: 0}).finalTribute();
		}
		
		Crafty.e("endText, endEAT").attr({ w: 220, h: 230, x: 375, y: 0});
		Crafty.e("endText, statsText").attr({ w: 285, h: 240, x: 90, y: 335});
		Crafty.e("endText, statsText").attr({ w: 285, h: 240, x: 620, y: 335});
		
		
		/* Winner */
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 20, x: 290, y: 352})
				.text("-")
				.css({ "color" : "#FFF", "font-size" : "30px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });		
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 10, x: 290, y: 395})
				.text("-")
				.css({ "color" : "#FFF", "font-size" : "19px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });		
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 10, x: 290, y: 418})
				.text("-")
				.css({ "color" : "#FFF", "font-size" : "19px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 10, x: 290, y: 441})
				.text("-")
				.css({ "color" : "#FFF", "font-size" : "19px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 10, x: 290, y: 464})
				.text("-")
				.css({ "color" : "#FFF", "font-size" : "19px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });
				
		/* Looser */
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 20, x: 820, y: 352})
				.text("-")
				.css({ "color" : "#FFF", "font-size" : "30px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });		
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 10, x: 820, y: 395})
				.text("-")
				.css({ "color" : "#FFF", "font-size" : "19px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });		
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 10, x: 820, y: 418})
				.text("-")
				.css({ "color" : "#FFF",  "font-size" : "19px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 10, x: 820, y: 441})
				.text("-")
				.css({ "color" : "#FFF", "font-size" : "19px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });
		Crafty.e("2D, DOM, Text").attr({ w: 50, h: 10, x: 820, y: 464})
				.text("-")
				.css({ "color" : "#FFF",  "font-size" : "19px", "text-align": "center", "font-weight" : "bold", "font-family" : "Arial, Helvetica, sans-serif" });
	},
	
	//-----------------------------------------------------------------------------
	//	Methods - Get cell
	//-----------------------------------------------------------------------------
	
	getCell: function(x, y) {
		var vX = Math.max(0, Math.min(x / ETA.config.scene.tile.width, this.cells.length - 1));
		var vY = Math.max(0, Math.min((y - 30) / ETA.config.scene.tile.height, this.cells[0].length - 1));
		
		return this.cells[parseInt(vX)][parseInt(vY)];
	}
});
