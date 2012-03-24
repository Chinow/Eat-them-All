window.onload = function() {
	Crafty.init(ETA.config.stageWidth, ETA.config.stageHeight, ETA.config.frameRate);
	//the loading screen that will display while our assets load
	Crafty.scene("loading", function (el) {
		//load takes an array of assets and a callback when complete
		Crafty.load([
		"img/bgSprite.png",
		"img/walkingZombi_rouge.png",
		"img/walkingZombi_bleu.png",
		"img/walkingDoll_rouge.png",
		"img/walkingDoll_bleu.png",
		"img/panneau_rouge.png",  
		"img/panneau_bleu.png", 
		"img/cimetierre_bleu.png", 
		"img/cimetierre_rouge.png",
		"img/forteresse_bleu.png",
		"img/forteresse_rouge.png"
		], function () {
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

		var cemetery = [];
		cemetery.push(Crafty.e("Cemetery, cemeteryRougeSprite")
				.Cemetery(1, 1, 3));
		cemetery.push(Crafty.e("Cemetery, cemeteryRougeSprite")
				.Cemetery(1, 1, 7));
				
		cemetery.push(Crafty.e("Cemetery, cemeteryBleuSprite")
				.Cemetery(2, 18, 3));
		cemetery.push(Crafty.e("Cemetery, cemeteryBleuSprite")
				.Cemetery(2, 18, 7));
		
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,0,"left");
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,1,"left");
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,2,"left");
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,4,"left");
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,5,"left");
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,6,"left");
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,8,"left");
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,9,"left");
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,10,"left");
			
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,0,"right");
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,1,"right");
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,2,"right");
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,4,"right");
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,5,"right");
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,6,"right");
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,8,"right");
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,9,"right");
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,10,"right");
		
		var player1 = Crafty.e("VoodooDoll, dollRougeSpriteLeft")
				.VoodooDoll(1);
		var player2 = Crafty.e("VoodooDoll, dollBleuSpriteRight")
				.VoodooDoll(2);
	});

	function generateWorld() {

		Crafty.sprite(16, "img/bgSprite.png", {
			bg: [0, 0,1000 ,550]
		});
		Crafty.sprite(65, "img/walkingZombi_rouge.png", {
			zombieRougeSprite: [0, 0]
		});
		Crafty.sprite(65, "img/walkingZombi_bleu.png", {
			zombieBleuSprite: [0, 0]
		});
		Crafty.sprite(65, "img/walkingDoll_rouge.png", {
			dollRougeSpriteLeft: [0, 0],
			dollRougeSpriteRight: [3, 0]
		});
		Crafty.sprite(65, "img/walkingDoll_bleu.png", {
			dollBleuSpriteLeft: [0, 0],
			dollBleuSpriteRight: [3, 0]
		});
		Crafty.sprite(65, "img/panneau_rouge.png", {
			signRougeSprite: [0, 0]
		});
		Crafty.sprite(65, "img/panneau_bleu.png", {
			signBleuSprite: [0, 0]
		});
		Crafty.sprite(110, "img/cimetierre_rouge.png", {
			cemeteryRougeSprite: [0, 0]
		});
		Crafty.sprite(110, "img/cimetierre_bleu.png", {
			cemeteryBleuSprite: [0, 0]
		});
		Crafty.sprite(70, "img/forteresse_rouge.png", {
			fortresseRougeSprite:[0, 0]
		});
		Crafty.sprite(70, "img/forteresse_bleu.png", {
			fortresseBleuSprite:[0, 0]
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

