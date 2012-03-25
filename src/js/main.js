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
			$('#loading-text').addClass('hideMenu');
			$('#start-button').removeClass('hideMenu');
			$('#start-button').click(function() {
				Crafty.scene("main"); //when everything is loaded, run the main scene
			});
		});

		//black background with some loading text
		Crafty.e('HTML')
			.attr({ w: ETA.config.stageWidth, h: ETA.config.stageHeight, x: 0, y: 0 })
			.replace(
				'<div id="menu">'+
					'<div id="title-game"><img src="img/Title_EatEmAll.png"/></div>'+
					'<div id="menu-button">'+
						'<div id="loading-text">LOADING ...</div>'+
						'<div id="start-button" class="hideMenu"><img src="img/start.png" alt="START"/></div>'+
						'<div id="option-button" class="hideMenu"><img src="img/option.png" alt="OPTION"/></div>'+
					'</div>'+
					'<div id="team-dev"><img src="img/Title_ZTeam.png"/></div>'+
					'<div id="game-dev-icon"><img src="img/Logo_Game_Dev_Party150x150.png" alt="GAMEDEV"/></div>'+
				'</div>'
		);
	});
	//automatically play the loading scene
	Crafty.scene("loading");

	Crafty.scene("main", function (e) {
		Crafty.audio.play("bgMusic", -1);
		generateWorld();
		
		var player1 = Crafty.e("VoodooDoll, dollRougeSpriteLeft")
				.VoodooDoll(1);
		var player2 = Crafty.e("VoodooDoll, dollBleuSpriteRight")
				.VoodooDoll(2);
				
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
			.Fortress(1,0,player1);
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,1,player1);
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,2,player1);
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,4,player1);
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,5,player1);
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,6,player1);
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,8,player1);
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,9,player1);
		Crafty.e("Fortress, fortresseRougeSprite")
			.Fortress(1,10,player1);
			
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,0,player2);
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,1,player2);
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,2,player2);
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,4,player2);
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,5,player2);
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,6,player2);
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,8,player2);
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,9,player2);
		Crafty.e("Fortress, fortresseBleuSprite")
			.Fortress(18,10,player2);
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
		ETA.player1FortressLife = ETA.config.game.hitPointsFortress;
		ETA.player2FortressLife = ETA.config.game.hitPointsFortress;
		ETA.grid = Crafty.e("BGGrid").grid(ETA.config.nbTileWidth, ETA.config.nbTileHeight);
	}
};

