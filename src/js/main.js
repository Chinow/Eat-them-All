window.onload = function() {
	var pop = 0;
	Crafty.init(ETA.config.stageWidth, ETA.config.stageHeight, ETA.config.frameRate);
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function (el) {
		//load takes an array of assets and a callback when complete
		Crafty.load(["img/bgSprite.png","img/walkingZombi.png","img/walkingDoll.png", "img/sign.png"], function () {
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
		Crafty.audio.play("bgMusic", -1);
		generateWorld();
		var player3 = Crafty.e("Zombie, zombieSprite")
		.Zombie()
		.attr({ x: 16, y: 80, z: 1000 });
		var player4 = Crafty.e("Zombie, zombieSprite")
		.Zombie()
		.attr({ x: 16, y: 160, z: 1000 });
		var player5 = Crafty.e("Zombie, zombieSprite")
		.Zombie()
		.attr({ x: 16, y: 200, z: 1000 });
		var player6 = Crafty.e("Zombie, zombieSprite")
		.Zombie()
		.attr({ x: 16, y: 304, z: 1000 });
		
		var player1 = Crafty.e("VoodooDoll, dollSpriteLeft")
				.VoodooDoll(1);
		var player2 = Crafty.e("VoodooDoll, dollSpriteRight")
				.VoodooDoll(2);
	});

	function generateWorld() {

		Crafty.sprite(16, "img/bgSprite.png", {
			bg: [0, 0,1000 ,550]
		});
		Crafty.sprite(65, "img/walkingZombi.png", {
			zombieSprite: [0, 0]
		});
		Crafty.sprite(65, "img/walkingDoll.png", {
			dollSpriteLeft: [0, 0],
			dollSpriteRight: [3, 0]
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
	//					 .attr({ x: 0, y: 0, z:1, w:1000, h:550}).draw();



	//	ETA.grid = Crafty.e('Grid, bg').attr({x: 0, y: 0, z: 1, w: ETA.config.stageWidth, h: ETA.config.stageHeight});
	//});

	//Crafty.scene('game');
};

