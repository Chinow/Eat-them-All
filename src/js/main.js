window.onload = function() {
	var pop = 0;
	Crafty.init(ETA.config.stageWidth, ETA.config.stageHeight, ETA.config.frameRate);
	Crafty.canvas.init();
	
	
	
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function (el) {
		//load takes an array of assets and a callback when complete
		Crafty.load(["img/bgSprite.png","img/walkingZombie.png", "img/sign.png"], function () {
			Crafty.scene("main"); //when everything is loaded, run the main scene
		});

		//black background with some loading text
		Crafty.background("#000");
		Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 150, y: 120 })
				.text("Loading")
				.css({ "text-align": "center" });
		});

	//automatically play the loading scene
	Crafty.scene("loading");
	
	Crafty.scene("main", function (e) {
		//var Env = Crafty.e("Env").display();
		generateWorld();
		
		 var player1 = Crafty.e("Zombie, zombieSprite, Controls")
            .attr({ x: 16, y: 304, z: 1 })
            .keyboard1Controls(3)
            .Zombie();
	});
	
	function generateWorld() {
		
		Crafty.sprite(16, "img/bgSprite.png", {
			bg: [0, 0,1000 ,550]
		});
		Crafty.sprite(65, "img/walkingZombie.png", {
			zombieSprite: [0, 0]
		});
		Crafty.sprite(ETA.config.tile.tileWidth, "img/sign.png", {
			signSprite: [0, 0]
		});
		ETA.grid = Crafty.e("BGGrid").grid(ETA.config.nbTileWidth, ETA.config.nbTileHeight);
		
		//Crafty.e('2D, DOM, bg')
		//	.attr({ x:0, y:0 , z:1 });
	}
		
	//Crafty.canvas();
	//Crafty.scene('game', function() {
	//Crafty.sprite(1, 'img/bgSprite.png', {'bg': [0, 0]}),

	//Crafty.e("2D, Canvas, bg")
	//           .attr({ x: 0, y: 0, z:1, w:1000, h:550}).draw();



	//  ETA.grid = Crafty.e('Grid, bg').attr({x: 0, y: 0, z: 1, w: ETA.config.stageWidth, h: ETA.config.stageHeight});
	//});	

	//Crafty.scene('game');
};

